import { API_KEY, BASE_URL, LEAGUE_ID, SEARCH_ALL_TEAMS_ENDPOINT } from '@/constants/api'
import type { Team } from '@/types/team.type'

type TeamApi = {
  idTeam: string
  strTeam: string
  strAlternate: string | null
  intFormedYear: string | null
  strLocation: string | null
  strCountry: string | null
  strDescriptionEN: string | null
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
      altName: team.strAlternate || null,
      formed: team.intFormedYear ? Number(team.intFormedYear) : null,
      location: team.strLocation || null,
      country: team.strCountry || null,
      description: team.strDescriptionEN || null,
      badge: team.strBadge || null,
      equipment: team.strEquipment || null,
    }))
  }
}
