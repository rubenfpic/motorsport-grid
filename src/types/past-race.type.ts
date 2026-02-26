import type { EventResult } from '@/types/event-result.type'

export type PastRace = {
  id: string
  name: string
  venue: string
  city: string
  country: string
  date: string | null
  podium: EventResult[]
}
