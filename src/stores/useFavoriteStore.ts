import { defineStore } from 'pinia'

const LS_FAVORITE_TEAM_KEY = 'favoriteTeamId'

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
      this.favoriteTeamId = teamId
      localStorage.setItem(LS_FAVORITE_TEAM_KEY, String(teamId))
    },
    clearFavoriteTeam() {
      this.favoriteTeamId = null
      localStorage.removeItem(LS_FAVORITE_TEAM_KEY)
    },
    hydrateFavoriteTeam() {
      const stored = localStorage.getItem(LS_FAVORITE_TEAM_KEY)
      if (stored === null) {
        return
      } else {
        const parsed = Number(stored)
        if (!Number.isInteger(parsed) || parsed <= 0) {
          this.clearFavoriteTeam()
        } else {
          this.setFavoriteTeam(parsed)
        }
      }
    },
  },
})
