import type { EventBase } from '@/types/event-base.type'

export type SeasonEvent = EventBase & {
  season: string
}
