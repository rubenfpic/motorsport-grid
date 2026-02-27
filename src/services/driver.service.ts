import { API_KEY, BASE_URL, LOOKUP_ALL_PLAYERS_ENDPOINT } from '@/constants/api'
import type { Driver } from '@/types/driver.type'

type DriverApi = {
  idDriver: string
  strDriver: string
  idTeam: string | null
  strTeam: string | null
  strNationality: string | null
  strDescriptionEN: string | null
  strCutout: string | null
}

type DriversResponse = {
  drivers: DriverApi[] | null
}

export class DriverService {
  async getDriversByTeam(teamId: number): Promise<Driver[]> {
    const url = `${BASE_URL}${API_KEY}/${LOOKUP_ALL_PLAYERS_ENDPOINT}?id=${teamId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener los pilotos del equipo`)
    }

    const data = (await response.json()) as DriversResponse

    if (!data?.drivers?.length) {
      return []
    }

    const drivers = data.drivers ?? []

    return drivers.map((driver) => ({
      id: Number(driver.idDriver),
      name: driver.strDriver,
      teamId: driver.idTeam != null ? Number(driver.idTeam) : null,
      team: driver.strTeam,
      nationality: driver.strNationality,
      description: driver.strDescriptionEN,
      photo: driver.strCutout,
    }))
  }
}
