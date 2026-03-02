import {
  API_KEY,
  BASE_URL,
  LOOKUP_ALL_PLAYERS_ENDPOINT,
  LOOKUPPLAYER_ENDPOINT,
} from '@/constants/api'
import type { Driver } from '@/types/driver.type'

type DriverApi = {
  idPlayer: string
  strPlayer: string
  idTeam: string | null
  strTeam: string | null
  strNationality: string | null
  strDescriptionEN: string | null
  strCutout: string | null
}

type DriversResponse = {
  player: DriverApi[] | null
}

type DriverDetailsResponse = {
  players: DriverApi[] | null
}

export class DriverService {
  async getDriversByTeam(teamId: number): Promise<Driver[]> {
    const url = `${BASE_URL}${API_KEY}/${LOOKUP_ALL_PLAYERS_ENDPOINT}?id=${teamId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener los pilotos del equipo`)
    }

    const data = (await response.json()) as DriversResponse

    if (!data?.player?.length) {
      return []
    }

    const drivers = data.player ?? []

    return drivers.map((driver) => ({
      id: Number(driver.idPlayer),
      name: driver.strPlayer,
      teamId: driver.idTeam != null ? Number(driver.idTeam) : null,
      team: driver.strTeam,
      nationality: driver.strNationality,
      description: driver.strDescriptionEN,
      photo: driver.strCutout,
    }))
  }

  async getDriverById(driverId: number): Promise<Driver | null> {
    const url = `${BASE_URL}${API_KEY}/${LOOKUPPLAYER_ENDPOINT}?id=${driverId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener datos del piloto`)
    }

    const data = (await response.json()) as DriverDetailsResponse
    const driver = data.players?.[0]

    if (!driver) return null

    return {
      id: Number(driver.idPlayer),
      name: driver.strPlayer,
      teamId: driver.idTeam != null ? Number(driver.idTeam) : null,
      team: driver.strTeam,
      nationality: driver.strNationality,
      description: driver.strDescriptionEN,
      photo: driver.strCutout,
    }
  }
}
