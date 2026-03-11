import { defineStore } from 'pinia'
import { useCompetitionStore } from './useCompetitionStore'

const getFavoriteTeamKey = (competitionId: string) => `favoriteTeamId:${competitionId}`

export const useFavoriteStore = defineStore('favorite', {
  state: (): {
    favoriteTeamId: number | null
  } => ({
    favoriteTeamId: null,
  }),

  getters: {
    isFavoriteTeam: (state) => (teamId: number) => state.favoriteTeamId === teamId,
  },

  actions: {
    setFavoriteTeam(teamId: number) {
      const competitionId = useCompetitionStore().competitionId
      const storageKey = getFavoriteTeamKey(competitionId)

      this.favoriteTeamId = teamId
      localStorage.setItem(storageKey, String(teamId))
    },

    clearFavoriteTeam() {
      const competitionId = useCompetitionStore().competitionId
      const storageKey = getFavoriteTeamKey(competitionId)

      this.favoriteTeamId = null
      localStorage.removeItem(storageKey)
    },

    hydrateFavoriteTeam() {
      const competitionId = useCompetitionStore().competitionId
      const storageKey = getFavoriteTeamKey(competitionId)

      const storedFavoriteTeam = localStorage.getItem(storageKey)

      if (storedFavoriteTeam === null) return

      const parsed = Number(storedFavoriteTeam)

      if (!Number.isInteger(parsed) || parsed <= 0) {
        this.clearFavoriteTeam()
        return
      }

      this.setFavoriteTeam(parsed)
    },
  },
})
