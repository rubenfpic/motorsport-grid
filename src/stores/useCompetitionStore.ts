import { AVAILABLE_LEAGUES, LEAGUE_ID } from '@/constants/api'
import { CompetitionService } from '@/services/competition.service'
import { defineStore } from 'pinia'

const competitionService = new CompetitionService()

export const useCompetitionStore = defineStore('competition', {
  state: () => ({
    competitionId: LEAGUE_ID,
    competitionName: '',
    availableCompetitionsMeta: {} as Record<string, { name: string; badge: string | null }>,
  }),
  actions: {
    async loadCompetitionMeta() {
      try {
        const competition = await competitionService.getCompetitionById(this.competitionId)

        this.competitionName = competition?.name ?? ''
      } catch (error) {
        console.error('Error fetching competition metadata:', error)
        this.competitionName = ''
      }
    },

    async loadAvailableCompetitionsMeta() {
      const metaById: Record<string, { name: string; badge: string | null }> = {}

      for (const id of AVAILABLE_LEAGUES) {
        try {
          const competition = await competitionService.getCompetitionById(id)

          metaById[id] = {
            name: competition?.name ?? id,
            badge: competition?.badge ?? null,
          }
        } catch (error) {
          console.error(`Error fetching competition metadata for ${id}:`, error)

          metaById[id] = {
            name: id,
            badge: null,
          }
        }
      }

      this.availableCompetitionsMeta = metaById
    },

    async setCompetitionId(competitionId: string) {
      if (!AVAILABLE_LEAGUES.includes(competitionId)) return
      this.competitionId = competitionId
      await this.loadCompetitionMeta()
    },
  },
})
