import type { SeasonEvent } from '@/types'
import { API_KEY, BASE_URL, LEAGUE_ID, SEASON_ENDPOINT } from '@/constants/api'

// Forma "cruda" de cada evento tal como llega desde la API.
type SeasonEventApi = {
  idEvent: string
  strEvent: string
  strSeason: string
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
  async getSeasonEventsByYear(seasonYear: string): Promise<SeasonEvent[]> {
    const url = `${BASE_URL}${API_KEY}/${SEASON_ENDPOINT}?id=${LEAGUE_ID}&s=${seasonYear}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener los eventos de la temporada`)
    }

    // Convertimos el JSON al tipo esperado para evitar trabajar con any.
    const data = (await response.json()) as SeasonEventsResponse
    const events = data.events ?? []

    // Aquí traducimos campos de API a nuestro tipo interno SeasonEvent.
    return events.map((event) => ({
      id: event.idEvent,
      name: event.strEvent,
      season: event.strSeason,
      venue: event.strVenue,
      city: event.strCity,
      country: event.strCountry,
      date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
    }))
  }
}
