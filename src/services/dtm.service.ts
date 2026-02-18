import type { PastRace, PodiumEntry } from '@/types/past-race.type'
import type { NextRace } from '@/types/next-race.type'

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/'
const API_KEY = '123'
const LEAGUE_ID = '4438'
const NEXT_RACE_ENDPOINT = 'eventsnextleague.php'
const PAST_RACE_ENDPOINT = 'eventspastleague.php'

export class DtmService {
  async getNextRace(): Promise<NextRace | null> {
    const url = `${BASE_URL}${API_KEY}/${NEXT_RACE_ENDPOINT}?id=${LEAGUE_ID}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener la próxima carrera`)
    }

    const data = await response.json()

    if (!data?.events?.length) {
      return null
    }

    const event = data.events[0]

    return {
      id: event.idEvent,
      name: event.strEvent,
      venue: event.strVenue,
      city: event.strCity,
      country: event.strCountry,
      date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
    }
  }

  async getPastRace(): Promise<PastRace | null> {
    const url = `${BASE_URL}${API_KEY}/${PAST_RACE_ENDPOINT}?id=${LEAGUE_ID}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener la última carrera`)
    }

    const data = await response.json()

    if (!data?.events?.length) {
      return null
    }

    const event = data.events[0]

    function parsePodium(result: string | null): PodiumEntry[] {
      if (!result) return []

      return result
        .split(/\r?\n/)
        .filter((line) => /^0[1-3]\t/.test(line))
        .slice(0, 3)
        .map((line) => {
          const cols = line
            .split('\t')
            .map((c) => c.trim())
            .filter(Boolean)
          return {
            position: Number(cols[0]),
            driver: cols[1]?.replace(/^\//, '') ?? '',
            team: cols[2]?.replace(/^\//, '') ?? '',
          }
        })
    }

    return {
      id: event.idEvent,
      name: event.strEvent,
      venue: event.strVenue,
      city: event.strCity,
      country: event.strCountry,
      date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
      podium: parsePodium(event.strResult),
    }
  }
}
