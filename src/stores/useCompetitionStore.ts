import { AVAILABLE_LEAGUES, LEAGUE_ID } from '@/constants/api'
import { CompetitionService } from '@/services/competition.service'
import { defineStore } from 'pinia'

const competitionService = new CompetitionService()

export const useCompetitionStore = defineStore('competition', {
  state: () => ({
    competitionId: LEAGUE_ID,
    competitionName: '',
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
    async setCompetitionId(competitionId: string) {
      if (!AVAILABLE_LEAGUES.includes(competitionId)) return
      this.competitionId = competitionId
      await this.loadCompetitionMeta()
    },
  },
})
