const cleanResultSegment = (value) => value.replace(/^\s*\/\s*/, '').trim()

const parseResult = (result, maxPositions) => {
  if (!result) return []

  const tabRows = result
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter((row) => /^\d{1,2}\s*\t/.test(row))

  let parsed = []

  if (tabRows.length) {
    parsed = tabRows.map((row) => {
      const cols = row
        .split('\t')
        .map((col) => col.trim())
        .filter(Boolean)

      return {
        position: Number(cols[0]),
        driver: cleanResultSegment(cols[1] ?? ''),
        team: cleanResultSegment(cols[2] ?? ''),
        time: cols[3] ? cleanResultSegment(cols[3]) : null,
      }
    })
  } else {
    const compact = result.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()
    const pattern =
      /(\d{1,2})\s*\/\s*([^/]+?)\s*\/\s*([^/]+?)\s*\/\s*([^/]+?)(?=\s+\d{1,2}\s*\/|$)/g

    for (const match of compact.matchAll(pattern)) {
      parsed.push({
        position: Number(match[1] ?? 0),
        driver: (match[2] ?? '').trim(),
        team: (match[3] ?? '').trim(),
        time: (match[4] ?? '').trim() || null,
      })
    }
  }

  return maxPositions !== undefined ? parsed.slice(0, maxPositions) : parsed
}

const cleanStandingsValue = (value) =>
  value
    .replace(/^\s*\/+\s*/, '')
    .replace(/\s*\/+\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim()

const parseStandingsFromResult = (result) => {
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

  const entries = []

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
      .map((segment) => cleanStandingsValue(segment))
      .filter(Boolean)

    if (segments.length < 3) continue

    const driver = segments[0]
    const team = segments[1]
    if (!driver || !team) continue

    const rest = segments.slice(2)
    const pointsRaw = cleanStandingsValue(rest.join(' / '))
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

const mapEventBase = (event) => ({
  id: event.idEvent,
  name: event.strEvent,
  venue: event.strVenue,
  city: event.strCity,
  country: event.strCountry,
  date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
  season: event.strSeason,
})

export class DashboardService {
  constructor(theSportsDbClient) {
    this.theSportsDbClient = theSportsDbClient
  }

  async buildDashboardPayload(competitionId) {
    const nextEventsResponse = await this.theSportsDbClient.getNextEventsByLeague(competitionId)
    const pastEventsResponse = await this.theSportsDbClient.getPastEventsByLeague(competitionId)

    const nextEventRaw = nextEventsResponse?.events?.[0] ?? null
    const pastEventRaw = pastEventsResponse?.events?.[0] ?? null

    const nextEvent = nextEventRaw ? mapEventBase(nextEventRaw) : null
    const pastEvent = pastEventRaw
      ? {
          ...mapEventBase(pastEventRaw),
          podium: parseResult(pastEventRaw.strResult, 3),
        }
      : null

    const standingsEntries = parseStandingsFromResult(pastEventRaw?.strResult ?? null)
    const currentStandings = standingsEntries.length
      ? {
          sourceEventId: pastEventRaw.idEvent,
          sourceEventName: pastEventRaw.strEvent,
          sourceDate: pastEventRaw.strTimestamp ? pastEventRaw.strTimestamp.slice(0, 10) : null,
          entries: standingsEntries,
        }
      : null

    return {
      competitionId,
      nextEvent,
      pastEvent,
      currentStandings,
    }
  }
}
