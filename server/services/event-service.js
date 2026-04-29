const cleanResultSegment = (value) => value.replace(/^\s*\/\s*/, '').trim()

const parseResult = (result) => {
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

  return parsed
}

const mapEventDetails = (event) => ({
  id: event.idEvent,
  name: event.strEvent,
  season: event.strSeason,
  venue: event.strVenue,
  city: event.strCity,
  country: event.strCountry,
  date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
  poster: event.strPoster || null,
  video: event.strVideo || null,
  result: parseResult(event.strResult),
})

export class EventService {
  constructor(theSportsDbClient) {
    this.theSportsDbClient = theSportsDbClient
  }

  async buildEventDetailsPayload(eventId) {
    const response = await this.theSportsDbClient.getEventById(eventId)
    const event = response?.events?.[0]
    return event ? mapEventDetails(event) : null
  }
}
