import type { SeasonEvent } from '@/types/season-event.type'

export type EventDetails = SeasonEvent & {
  poster: string | null
  video: string | null
  result: string | null
}
