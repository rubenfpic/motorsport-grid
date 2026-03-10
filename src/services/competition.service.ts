import { API_KEY, BASE_URL, COMPETITION_ENDPOINT } from '@/constants/api'
import type { Competition } from '@/types'

type CompetitionApi = {
  idLeague: string
  strLeague: string
  strSport: string | null
  strCountry: string | null
  strCurrentSeason: string | null
  strLogo: string | null
  strBadge: string | null
  strPoster: string | null
}

type CompetitionResponse = {
  leagues: CompetitionApi[] | null
}

export class CompetitionService {
  async getCompetitionById(competitionId: string): Promise<Competition | null> {
    const url = `${BASE_URL}${API_KEY}/${COMPETITION_ENDPOINT}?id=${competitionId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching competition`)
    }

    const data = (await response.json()) as CompetitionResponse
    const competition = data.leagues?.[0]

    if (!competition) return null

    return {
      id: competition.idLeague,
      name: competition.strLeague,
      sport: competition.strSport,
      country: competition.strCountry,
      currentSeason: competition.strCurrentSeason,
      logo: competition.strLogo,
      badge: competition.strBadge,
      poster: competition.strPoster,
    }
  }
}
