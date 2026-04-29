import type { Driver } from '@/types'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL ?? ''

export class DriverService {
  async getDriversByTeamId(teamId: number): Promise<Driver[]> {
    const url = `${BACKEND_BASE_URL}/api/team-drivers/${teamId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching team drivers`)
    }

    return (await response.json()) as Driver[]
  }

  async getDriverById(driverId: number): Promise<Driver | null> {
    const url = `${BACKEND_BASE_URL}/api/driver/${driverId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching driver data`)
    }

    return (await response.json()) as Driver | null
  }
}
