import { TeamService } from '@/services/team.service'
import { useCompetitionStore } from '@/stores/useCompetitionStore'
import type { Team } from '@/types'
import { onMounted, ref, watch } from 'vue'

export function useTeamDetails(teamId: number) {
  const team = ref<Team | null>(null)
  const teamError = ref<string>('')
  const isLoading = ref(true)
  const teamService = new TeamService()
  const competitionStore = useCompetitionStore()

  const loadTeamDetails = async () => {
    teamError.value = ''
    isLoading.value = true

    try {
      team.value = await teamService.getTeamById(teamId)
    } catch (error) {
      console.error('Error al obtener los detalles del equipo:', error)
      teamError.value = 'No se pudieron cargar los detalles del equipo.'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadTeamDetails)

  watch(() => competitionStore.competitionId, loadTeamDetails)

  return {
    team,
    teamError,
    isLoading,
    loadTeamDetails,
  }
}
