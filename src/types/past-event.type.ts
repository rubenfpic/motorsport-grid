import type { EventResult } from '@/types/event-result.type'

export type PastEvent = {
  id: string
  name: string
  venue: string
  city: string
  country: string
  date: string | null
  podium: EventResult[]
}
