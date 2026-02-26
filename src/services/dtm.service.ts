import {
  API_KEY,
  BASE_URL,
  LEAGUE_ID,
  NEXT_RACE_ENDPOINT,
  PAST_RACE_ENDPOINT,
} from '@/constants/api'
import type { NextRace } from '@/types/next-race.type'
import type { PastRace } from '@/types/past-race.type'
import { parseResult } from '@/utils/result.parser'

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

    return {
      id: event.idEvent,
      name: event.strEvent,
      venue: event.strVenue,
      city: event.strCity,
      country: event.strCountry,
      date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
      podium: parseResult(event.strResult, 3),
    }
  }
}
