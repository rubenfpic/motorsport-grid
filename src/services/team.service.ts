import { LEAGUE_ID } from '@/constants/api'
import { useCompetitionStore } from '@/stores/useCompetitionStore'
import type { Team } from '@/types'

const getCompetitionId = () => useCompetitionStore().competitionId || LEAGUE_ID
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL ?? ''

export class TeamService {
  async getTeams(): Promise<Team[]> {
    const url = `${BACKEND_BASE_URL}/api/teams/${getCompetitionId()}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching teams`)
    }

    return (await response.json()) as Team[]
  }

  async getTeamById(teamId: number): Promise<Team | null> {
    const url = `${BACKEND_BASE_URL}/api/team/${getCompetitionId()}/${teamId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching team details`)
    }

    return (await response.json()) as Team | null
  }
}
