const mapCompetition = (competition) => ({
  id: competition.idLeague,
  name: competition.strLeague,
  sport: competition.strSport,
  country: competition.strCountry,
  currentSeason: competition.strCurrentSeason,
  logo: competition.strLogo,
  badge: competition.strBadge,
  poster: competition.strPoster,
})

export class CompetitionService {
  constructor(theSportsDbClient) {
    this.theSportsDbClient = theSportsDbClient
  }

  async buildCompetitionPayload(competitionId) {
    const response = await this.theSportsDbClient.getCompetitionById(competitionId)
    const competition = response?.leagues?.[0]
    return competition ? mapCompetition(competition) : null
  }
}
