import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', {
  state: (): { favoriteTeamId: number | null } => ({
    favoriteTeamId: null,
  }),
  getters: {
    isFavoriteTeam: (state) => (teamId: number) => state.favoriteTeamId === teamId,
    // Versión equivalente:
    // isFavoriteTeam: (state) => {
    //   return (teamId: number) => {
    //     return state.favoriteTeamId === teamId
    //   }
    // },
  },
  actions: {
    setFavoriteTeam(teamId: number) {
      this.favoriteTeamId = teamId
    },
    clearFavoriteTeam() {
      this.favoriteTeamId = null
    },
  },
})
