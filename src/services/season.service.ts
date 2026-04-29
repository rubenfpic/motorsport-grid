import { LEAGUE_ID } from '@/constants/api'
import { useCompetitionStore } from '@/stores/useCompetitionStore'
import type { SeasonEvent } from '@/types'

const getCompetitionId = () => useCompetitionStore().competitionId || LEAGUE_ID
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL ?? ''

export default class SeasonService {
  async getSeasonEventsByYear(seasonYear: string): Promise<SeasonEvent[]> {
    const url = `${BACKEND_BASE_URL}/api/season-events/${getCompetitionId()}/${seasonYear}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching season events`)
    }

    return (await response.json()) as SeasonEvent[]
  }
}
