const mapSeasonEvent = (event) => ({
  id: event.idEvent,
  name: event.strEvent,
  season: event.strSeason ?? '',
  venue: event.strVenue,
  city: event.strCity,
  country: event.strCountry,
  date: event.strTimestamp ? event.strTimestamp.slice(0, 10) : null,
})

const sortEventsByDate = (events) =>
  events.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date.localeCompare(b.date)
  })

export class SeasonService {
  constructor(theSportsDbClient) {
    this.theSportsDbClient = theSportsDbClient
  }

  async buildSeasonEventsPayload(competitionId, seasonYear) {
    const seasonResponse = await this.theSportsDbClient.getSeasonEventsByLeague(
      competitionId,
      seasonYear,
    )
    const pastResponse = await this.theSportsDbClient.getPastEventsByLeague(competitionId)

    const seasonEvents = seasonResponse?.events ? [...seasonResponse.events] : []
    const pastEvent = pastResponse?.events?.[0] ?? null

    if (pastEvent) {
      const alreadyExists = seasonEvents.some((event) => event.idEvent === pastEvent.idEvent)
      const sameSeason = pastEvent.strSeason?.trim() === seasonYear.trim()

      if (!alreadyExists && sameSeason) {
        seasonEvents.push(pastEvent)
      }
    }

    return sortEventsByDate(seasonEvents.map(mapSeasonEvent))
  }
}
