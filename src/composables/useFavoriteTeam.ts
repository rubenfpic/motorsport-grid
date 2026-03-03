import { useTeamDetails } from '@/composables/useTeamDetails'
import { useFavoriteStore } from '@/stores/useFavoriteStore'
import { computed } from 'vue'

export function useFavoriteTeam() {
  const favorite = useFavoriteStore()
  const favoriteTeamId = computed(() => favorite.favoriteTeamId)
  const favoriteTeamDetails = favoriteTeamId.value ? useTeamDetails(favoriteTeamId.value) : null
  const favoriteTeam = computed(() => favoriteTeamDetails?.team.value ?? null)
  const isLoading = computed(() => favoriteTeamDetails?.isLoading.value ?? false)
  const error = computed(() => favoriteTeamDetails?.teamError.value ?? '')
  const isEmpty = computed(() => favoriteTeamId.value == null)

  return {
    favoriteTeam,
    error,
    isLoading,
    isEmpty,
  }
}
