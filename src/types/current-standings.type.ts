import type { StandingsEntry } from '@/types/standings-entry.type'

export type CurrentStandings = {
  sourceEventId: string
  sourceEventName: string
  sourceDate: string | null
  entries: StandingsEntry[]
}
