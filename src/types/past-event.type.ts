import type { EventBase } from '@/types/event-base.type'
import type { EventResult } from '@/types/event-result.type'

export type PastEvent = EventBase & {
  podium: EventResult[]
}
