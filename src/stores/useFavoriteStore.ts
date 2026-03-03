import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', {
  state: (): { favoriteTeamId: number | null } => ({
    favoriteTeamId: null,
  }),
  actions: {
    setFavoriteTeam(teamId: number) {
      this.favoriteTeamId = teamId
    },
    clearFavoriteTeam() {
      this.favoriteTeamId = null
    },
    isFavoriteTeam(teamId: number) {
      return this.favoriteTeamId === teamId
    },
  },
})
