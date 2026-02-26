import type { SeasonEvent } from '@/types/season-event.type'
import type { EventResult } from './event-result.type'

export type EventDetails = SeasonEvent & {
  poster: string | null
  video: string | null
  result: EventResult[]
}
