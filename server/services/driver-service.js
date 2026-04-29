const mapDriver = (driver) => ({
  id: Number(driver.idPlayer),
  name: driver.strPlayer,
  teamId: driver.idTeam != null ? Number(driver.idTeam) : null,
  team: driver.strTeam,
  nationality: driver.strNationality,
  description: driver.strDescriptionEN,
  photo: driver.strCutout,
})

const getDriversArray = (response) => response?.player ?? response?.players ?? []

export class DriverService {
  constructor(theSportsDbClient) {
    this.theSportsDbClient = theSportsDbClient
  }

  async buildTeamDriversPayload(teamId) {
    const response = await this.theSportsDbClient.getDriversByTeamId(teamId)
    return getDriversArray(response).map(mapDriver)
  }

  async buildDriverPayload(driverId) {
    const response = await this.theSportsDbClient.getDriverById(driverId)
    const driver = getDriversArray(response)[0]
    return driver ? mapDriver(driver) : null
  }
}
