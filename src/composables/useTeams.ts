import { TeamService } from '@/services/team.service'
import type { Team } from '@/types'
import { onMounted, ref } from 'vue'

export function useTeams() {
  const teams = ref<Team[]>([])
  const teamsError = ref<string>('')
  const isLoading = ref(true)
  const teamService = new TeamService()

  const loadTeams = async () => {
    teamsError.value = ''
    isLoading.value = true

    try {
      teams.value = await teamService.getTeams()
    } catch (error) {
      console.error('Error al obtener los equipos:', error)
      teamsError.value = 'No se pudieron cargar los equipos.'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    void loadTeams()
  })

  return {
    teams,
    teamsError,
    isLoading,
    loadTeams,
  }
}
