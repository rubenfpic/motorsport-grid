import type { Competition } from '@/types'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL ?? ''

export class CompetitionService {
  async getCompetitionById(competitionId: string): Promise<Competition | null> {
    const url = `${BACKEND_BASE_URL}/api/competition/${competitionId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching competition`)
    }

    return (await response.json()) as Competition | null
  }
}
