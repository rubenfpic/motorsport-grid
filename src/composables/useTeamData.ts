import { TeamService } from '@/services/team.service'
import type { Team } from '@/types/team.type'
import { onMounted, ref } from 'vue'

export function useTeamData(teamId?: number) {
  const teams = ref<Team[]>([])
  const teamsError = ref<string>('')
  const isLoading = ref(true)
  const team = ref<Team | null>(null)
  const teamError = ref<string>('')
  const isTeamLoading = ref(true)
  const teamService = new TeamService()

  const loadTeamsData = async () => {
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

  const loadTeamData = async (teamId: number) => {
    teamError.value = ''
    isTeamLoading.value = true

    try {
      team.value = await teamService.getTeamDetails(teamId)
    } catch (error) {
      console.error('Error al obtener los detalles del equipo:', error)
      teamError.value = 'No se pudieron cargar los detalles del equipo.'
    } finally {
      isTeamLoading.value = false
    }
  }

  onMounted(() => {
    if (teamId !== undefined) void loadTeamData(teamId)
    else void loadTeamsData()
  })

  return {
    teams,
    teamsError,
    isLoading,
    loadTeamsData,
    team,
    teamError,
    isTeamLoading,
    loadTeamData,
  }
}
