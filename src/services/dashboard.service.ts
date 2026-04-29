import { LEAGUE_ID } from '@/constants/api'
import { useCompetitionStore } from '@/stores/useCompetitionStore'
import type { CurrentStandings, NextEvent, PastEvent } from '@/types'

const getCompetitionId = () => useCompetitionStore().competitionId || LEAGUE_ID
const DASHBOARD_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL ?? ''
const DASHBOARD_ENDPOINT = '/api/dashboard'

type DashboardPayload = {
  competitionId: string
  nextEvent: NextEvent | null
  pastEvent: PastEvent | null
  currentStandings: CurrentStandings | null
}

export class DashboardService {
  private async getDashboardPayload(): Promise<DashboardPayload> {
    const competitionId = getCompetitionId()
    const url = `${DASHBOARD_BACKEND_BASE_URL}${DASHBOARD_ENDPOINT}/${competitionId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching dashboard`)
    }

    return (await response.json()) as DashboardPayload
  }

  async getNextEvent(): Promise<NextEvent | null> {
    const payload = await this.getDashboardPayload()
    return payload.nextEvent
  }

  async getPastEvent(): Promise<PastEvent | null> {
    const payload = await this.getDashboardPayload()
    return payload.pastEvent
  }

  async getCurrentStandings(): Promise<CurrentStandings | null> {
    const payload = await this.getDashboardPayload()
    return payload.currentStandings
  }
}
