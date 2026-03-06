import { API_KEY, BASE_URL, LEAGUE_ID, SEARCH_ALL_TEAMS_ENDPOINT } from '@/constants/api'
import type { Team } from '@/types'

type TeamApi = {
  idTeam: string
  strTeam: string
  intFormedYear: string | null
  strLocation: string | null
  strCountry: string | null
  strDescriptionEN: string | null
  strLogo: string | null
  strBadge: string | null
  strEquipment: string | null
}

type TeamsResponse = {
  teams: TeamApi[] | null
}

export class TeamService {
  async getTeams(): Promise<Team[]> {
    const url = `${BASE_URL}${API_KEY}/${SEARCH_ALL_TEAMS_ENDPOINT}?id=${LEAGUE_ID}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener los equipos`)
    }

    const data = (await response.json()) as TeamsResponse

    if (!data?.teams?.length) {
      return []
    }

    const teams = data.teams ?? []

    return teams.map((team) => ({
      id: Number(team.idTeam),
      name: team.strTeam,
      formed: team.intFormedYear ? Number(team.intFormedYear) : null,
      location: team.strLocation || null,
      country: team.strCountry || null,
      description: team.strDescriptionEN || null,
      logo: team.strLogo || null,
      badge: team.strBadge || null,
      equipment: team.strEquipment || null,
    }))
  }

  async getTeamById(teamId: number): Promise<Team | null> {
    const url = `${BASE_URL}${API_KEY}/${SEARCH_ALL_TEAMS_ENDPOINT}?id=${LEAGUE_ID}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener los detalles del equipo`)
    }

    const data = (await response.json()) as TeamsResponse

    if (!data?.teams?.length) {
      return null
    }

    const teamData = data.teams.find((team) => Number(team.idTeam) === teamId)

    if (!teamData) {
      return null
    }

    return {
      id: Number(teamData.idTeam),
      name: teamData.strTeam,
      formed: teamData.intFormedYear ? Number(teamData.intFormedYear) : null,
      location: teamData.strLocation || null,
      country: teamData.strCountry || null,
      description: teamData.strDescriptionEN || null,
      logo: teamData.strLogo || null,
      badge: teamData.strBadge || null,
      equipment: teamData.strEquipment || null,
    }
  }
}
