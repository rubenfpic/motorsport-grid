import {
  API_KEY,
  BASE_URL,
  LEAGUE_ID,
  NEXT_EVENT_ENDPOINT,
  PAST_EVENT_ENDPOINT,
} from '@/constants/api'
import type { CurrentStandings, NextEvent, PastEvent, StandingsEntry } from '@/types'
import { parseResult } from '@/utils/result.parser'

type DashboardEventApi = {
  idEvent: string
  strEvent: string
  strVenue: string
  strCity: string
  strCountry: string
  strTimestamp: string | null
  strSeason: string | null
  strResult: string | null
}

type DashboardResponse = {
  events: DashboardEventApi[] | null
}

export class DashboardService {
  private cleanStandingsValue(value: string): string {
    return value
      .replace(/^\s*\/+\s*/, '')
      .replace(/\s*\/+\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private parseStandingsFromResult(result: string | null): StandingsEntry[] {
    if (!result) return []

    const normalized = result.replace(/\r\n/g, '\n')
    const titleRegex = /(?:Current|Final)\s+Championship\s+Standings[^\n]*(?:\n|$)/i
    const titleMatch = normalized.match(titleRegex)

    if (!titleMatch || titleMatch.index === undefined) return []

    const start = titleMatch.index + titleMatch[0].length
    const standingsBlock = normalized.slice(start)
    const lines = standingsBlock
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const entries: StandingsEntry[] = []

    for (const line of lines) {
      if (/^Pos\b/i.test(line)) continue

      const compact = line.replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim()
      const posMatch = compact.match(/^(\d{1,2})\s*\/?\s*(.+)$/)

      if (!posMatch) continue

      const position = Number(posMatch[1])
      if (!Number.isFinite(position)) continue

      const standingsRow = posMatch[2]
      if (!standingsRow) continue

      const segments = standingsRow
        .split('/')
        .map((segment) => this.cleanStandingsValue(segment))
        .filter(Boolean)

      if (segments.length < 3) continue

      const driver = segments[0]
      const team = segments[1]
      if (!driver || !team) continue

      const rest = segments.slice(2)
      const pointsRaw = this.cleanStandingsValue(rest.join(' / '))
      const pointsMatch = pointsRaw.match(/^(\d+)/)
      const points = pointsMatch?.[1] ?? pointsRaw

      entries.push({
        position,
        driver,
        team,
        pointsRaw,
        points,
      })
    }

    return entries
  }

  private async getPastEventRaw(): Promise<DashboardEventApi | null> {
    const url = `${BASE_URL}${API_KEY}/${PAST_EVENT_ENDPOINT}?id=${LEAGUE_ID}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching last race`)
    }

    const data = (await response.json()) as DashboardResponse

    return data.events?.[0] ?? null
  }

  async getNextEvent(): Promise<NextEvent | null> {
    const url = `${BASE_URL}${API_KEY}/${NEXT_EVENT_ENDPOINT}?id=${LEAGUE_ID}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} while fetching next race`)
    }

    const data = await response.json()

    if (!data?.events?.length) {
      return null
    }

    const event = data.events[0]

    return {
      id: event.idEvent,
      name: event.strEvent,
      venue: event.strVenue,
      city: event.strCity,
      country: event.strCountry,
      date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
      season: event.strSeason,
    }
  }

  async getPastEvent(): Promise<PastEvent | null> {
    const event = await this.getPastEventRaw()

    if (!event) return null

    return {
      id: event.idEvent,
      name: event.strEvent,
      venue: event.strVenue,
      city: event.strCity,
      country: event.strCountry,
      date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
      season: event.strSeason,
      podium: parseResult(event.strResult, 3),
    }
  }

  async getCurrentStandings(): Promise<CurrentStandings | null> {
    const event = await this.getPastEventRaw()

    if (!event) return null

    const entries = this.parseStandingsFromResult(event.strResult)

    if (!entries.length) return null

    return {
      sourceEventId: event.idEvent,
      sourceEventName: event.strEvent,
      sourceDate: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
      entries,
    }
  }
}
