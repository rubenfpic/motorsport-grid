const mapTeam = (team) => ({
  id: Number(team.idTeam),
  name: team.strTeam,
  formed: team.intFormedYear ? Number(team.intFormedYear) : null,
  location: team.strLocation || null,
  country: team.strCountry || null,
  description: team.strDescriptionEN || null,
  logo: team.strLogo || null,
  badge: team.strBadge || null,
  equipment: team.strEquipment || null,
})

export class TeamService {
  constructor(theSportsDbClient) {
    this.theSportsDbClient = theSportsDbClient
  }

  async buildTeamsPayload(competitionId) {
    const response = await this.theSportsDbClient.getTeamsByLeague(competitionId)
    const teams = response?.teams ?? []
    return teams.map(mapTeam)
  }

  async buildTeamPayload(competitionId, teamId) {
    const teams = await this.buildTeamsPayload(competitionId)
    return teams.find((team) => team.id === Number(teamId)) ?? null
  }
}
