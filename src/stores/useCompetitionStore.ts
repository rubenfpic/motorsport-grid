import { AVAILABLE_LEAGUES, LEAGUE_ID } from '@/constants/api'
import { defineStore } from 'pinia'

export const useCompetitionStore = defineStore('competition', {
  state: () => ({
    competitionId: LEAGUE_ID,
  }),
  actions: {
    setCompetitionId(competitionId: string) {
      if (!AVAILABLE_LEAGUES.includes(competitionId)) return
      this.competitionId = competitionId
    },
  },
})
