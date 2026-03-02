import { TeamService } from '@/services/team.service'
import type { Team } from '@/types/team.type'
import { onMounted, ref } from 'vue'

export function useTeamDetails(teamId: number) {
  const team = ref<Team | null>(null)
  const teamError = ref<string>('')
  const isLoading = ref(true)
  const teamService = new TeamService()

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

  onMounted(() => {
    void loadTeamDetails()
  })

  return {
    team,
    teamError,
    isLoading,
    loadTeamDetails,
  }
}
