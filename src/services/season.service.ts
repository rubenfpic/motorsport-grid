import { API_KEY, BASE_URL, LEAGUE_ID, PAST_EVENT_ENDPOINT, SEASON_ENDPOINT } from '@/constants/api'
import type { SeasonEvent } from '@/types'

// Forma "cruda" de cada evento tal como llega desde la API.
type SeasonEventApi = {
  idEvent: string
  strEvent: string
  strSeason: string | null
  strVenue: string
  strCity: string
  strCountry: string
  strTimestamp: string | null
}

// Forma de la respuesta completa del endpoint de temporada.
type SeasonEventsResponse = {
  events: SeasonEventApi[] | null
}

export default class SeasonService {
  // Cogemos el último evento por si hay que añadirlo a los que devuelve la API.
  private async getPastEventRaw(): Promise<SeasonEventApi | null> {
    const url = `${BASE_URL}${API_KEY}/${PAST_EVENT_ENDPOINT}?id=${LEAGUE_ID}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener la última carrera`)
    }

    const data = (await response.json()) as SeasonEventsResponse
    return data.events?.[0] ?? null
  }

  async getSeasonEventsByYear(seasonYear: string): Promise<SeasonEvent[]> {
    const url = `${BASE_URL}${API_KEY}/${SEASON_ENDPOINT}?id=${LEAGUE_ID}&s=${seasonYear}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener los eventos de la temporada`)
    }

    // Convertimos el JSON al tipo esperado para evitar trabajar con any.
    const data = (await response.json()) as SeasonEventsResponse
    const events = data.events ?? []

    // Si pastEvent no está en eventsseason y sí pertenece a esta temporada, lo añadimos.
    const pastEvent = await this.getPastEventRaw()
    if (pastEvent) {
      const alreadyExists = events.some((event) => event.idEvent === pastEvent.idEvent)
      const sameSeason = pastEvent.strSeason?.trim() === seasonYear.trim()

      if (!alreadyExists && sameSeason) {
        events.push(pastEvent)
      }
    }

    // Aquí traducimos campos de API a nuestro tipo interno SeasonEvent.
    const mappedEvents = events.map((event) => ({
      id: event.idEvent,
      name: event.strEvent,
      season: event.strSeason ?? '',
      venue: event.strVenue,
      city: event.strCity,
      country: event.strCountry,
      date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
    }))

    mappedEvents.sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return a.date.localeCompare(b.date)
    })

    return mappedEvents
  }
}
