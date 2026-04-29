import type { EventDetails } from '@/types'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL ?? ''

export default class EventService {
  async getEventById(eventId: string): Promise<EventDetails | null> {
    const url = `${BACKEND_BASE_URL}/api/event/${eventId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching event`)
    }

    return (await response.json()) as EventDetails | null
  }
}
