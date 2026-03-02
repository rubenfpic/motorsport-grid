import { API_KEY, BASE_URL, EVENT_ENDPOINT } from '@/constants/api'
import type { EventDetails } from '@/types/event-details.type'
import { parseResult } from '@/utils/result.parser'

type EventDetailsApi = {
  idEvent: string
  strEvent: string
  strSeason: string
  strVenue: string
  strCity: string
  strCountry: string
  strTimestamp: string | null
  strPoster: string | null
  strVideo: string | null
  strResult: string | null
}

type EventDetailsResponse = {
  events: EventDetailsApi[] | null
}

export default class EventService {
  async getEventById(eventId: string): Promise<EventDetails | null> {
    const url = `${BASE_URL}${API_KEY}/${EVENT_ENDPOINT}?id=${eventId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al obtener el evento`)
    }

    const data = (await response.json()) as EventDetailsResponse
    const event = data.events?.[0]

    if (!event) return null

    return {
      id: event.idEvent,
      name: event.strEvent,
      season: event.strSeason,
      venue: event.strVenue,
      city: event.strCity,
      country: event.strCountry,
      date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
      poster: event.strPoster || null,
      video: event.strVideo || null,
      result: parseResult(event.strResult),
    }
  }
}
