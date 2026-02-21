import type { SeasonEvent } from '@/types/season-event.type'

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/'
const API_KEY = '123'
const LEAGUE_ID = '4438'
const SEASON_ENDPOINT = 'eventsseason.php'

// Forma "cruda" de cada evento tal como llega desde la API.
type SeasonEventApi = {
  idEvent: string
  strEvent: string
  strSeason: string
  strVenue: string
  strCity: string
  strCountry: string
  strTimestamp: string | null
  strPoster: string | null
}

// Forma de la respuesta completa del endpoint de temporada.
type SeasonEventsResponse = {
  events: SeasonEventApi[] | null
}

export class SeasonService {
  async getSeasonEvents(season: string): Promise<SeasonEvent[]> {
    const url = `${BASE_URL}${API_KEY}/${SEASON_ENDPOINT}?id=${LEAGUE_ID}&s=${season}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener los eventos de la temporada`)
    }

    // Convertimos el JSON al tipo esperado para evitar trabajar con any.
    const data = (await response.json()) as SeasonEventsResponse

    if (!data.events?.length) return []

    // Aquí traducimos campos de API a nuestro tipo interno SeasonEvent.
    return data.events.map((event) => ({
      id: event.idEvent,
      name: event.strEvent,
      season: event.strSeason,
      venue: event.strVenue,
      city: event.strCity,
      country: event.strCountry,
      date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
      poster: event.strPoster || null,
    }))
  }
}
