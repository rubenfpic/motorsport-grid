import express from 'express'
import { TheSportsDbClient, TheSportsDbClientError } from './clients/the-sports-db-client.js'
import { DB_PATH, initCacheDb } from './db/cache-db.js'
import { createCacheRepository } from './repositories/cache-repository.js'
import { CompetitionService } from './services/competition-service.js'
import { DashboardService } from './services/dashboard-service.js'
import { DriverService } from './services/driver-service.js'
import { EventService } from './services/event-service.js'
import { SeasonService } from './services/season-service.js'
import { TeamService } from './services/team-service.js'

const app = express()
const PORT = 3000
let cacheRepository
const theSportsDbClient = new TheSportsDbClient()
const competitionService = new CompetitionService(theSportsDbClient)
const dashboardService = new DashboardService(theSportsDbClient)
const driverService = new DriverService(theSportsDbClient)
const eventService = new EventService(theSportsDbClient)
const seasonService = new SeasonService(theSportsDbClient)
const teamService = new TeamService(theSportsDbClient)

app.use(express.json())

const getDashboardCacheKey = (competitionId) => `dashboard:${competitionId}`
const getCompetitionCacheKey = (competitionId) => `competition:${competitionId}`
const getSeasonEventsCacheKey = (competitionId, seasonYear) =>
  `season-events:${competitionId}:${seasonYear}`
const getEventCacheKey = (eventId) => `event:${eventId}`
const getTeamsCacheKey = (competitionId) => `teams:${competitionId}`
const getTeamDriversCacheKey = (teamId) => `team-drivers:${teamId}`
const getDriverCacheKey = (driverId) => `driver:${driverId}`

const sendUpstreamError = (response, error) => {
  if (error instanceof TheSportsDbClientError) {
    if (error.code === 'UPSTREAM_TIMEOUT') {
      response.status(504).json({ error: error.message, code: error.code })
      return
    }

    response.status(502).json({ error: error.message, code: error.code, upstreamStatus: error.status })
    return
  }

  response.status(500).json({ error: 'Unexpected backend error' })
}

const getOrSetCachePayload = async (cacheKey, buildPayload) => {
  const cached = await cacheRepository.getCache(cacheKey)
  if (cached) return cached.payload

  const payload = await buildPayload()
  await cacheRepository.setCache(cacheKey, payload, {
    source: 'upstream',
    status: 'ok',
  })
  return payload
}

// Este endpoint sirve para comprobar rápidamente que el backend está vivo y conectado a su configuración básica.
app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'motorsport-grid-backend',
    dbPath: DB_PATH,
    timestamp: new Date().toISOString(),
  })
})

// Esta ruta guarda o actualiza en SQLite el JSON asociado a una clave de cache concreta.
app.put('/api/cache/:key', async (request, response) => {
  const cacheKey = request.params.key
  const { payload, source = 'manual', status = 'ok' } = request.body ?? {}

  if (!cacheKey) {
    response.status(400).json({ error: 'cache key is required' })
    return
  }

  if (payload === undefined) {
    response.status(400).json({ error: 'payload is required' })
    return
  }

  // La escritura se delega al repositorio para no mezclar SQL con la capa HTTP.
  const row = await cacheRepository.setCache(cacheKey, payload, {
    source,
    status,
  })

  response.json(row)
})

// Esta ruta devuelve la entrada de cache de una clave concreta si existe en la base de datos.
app.get('/api/cache/:key', async (request, response) => {
  const cacheKey = request.params.key
  const row = await cacheRepository.getCache(cacheKey)

  if (!row) {
    response.status(404).json({ error: 'cache entry not found' })
    return
  }

  response.json(row)
})

// Esta ruta valida que el backend puede consultar TheSportsDB y devolver su respuesta sin pasar por frontend.
app.get('/api/upstream/competition/:competitionId', async (request, response) => {
  const competitionId = request.params.competitionId

  if (!competitionId) {
    response.status(400).json({ error: 'competitionId is required' })
    return
  }

  try {
    const data = await theSportsDbClient.getCompetitionById(competitionId)
    response.json(data)
  } catch (error) {
    sendUpstreamError(response, error)
  }
})

// Esta ruta sirve el dashboard cacheado para una competición, y solo consulta la API externa si no existe cache.
app.get('/api/dashboard/:competitionId', async (request, response) => {
  const competitionId = request.params.competitionId

  if (!competitionId) {
    response.status(400).json({ error: 'competitionId is required' })
    return
  }

  const cacheKey = getDashboardCacheKey(competitionId)
  const cachedDashboard = await cacheRepository.getCache(cacheKey)

  if (cachedDashboard) {
    response.json(cachedDashboard.payload)
    return
  }

  try {
    const payload = await getOrSetCachePayload(cacheKey, () =>
      dashboardService.buildDashboardPayload(competitionId),
    )
    response.json(payload)
  } catch (error) {
    sendUpstreamError(response, error)
  }
})

// Esta ruta fuerza el refresco del dashboard en cache para una competición, aunque ya existan datos guardados.
app.post('/api/admin/refresh/dashboard/:competitionId', async (request, response) => {
  const competitionId = request.params.competitionId

  if (!competitionId) {
    response.status(400).json({ error: 'competitionId is required' })
    return
  }

  try {
    const payload = await dashboardService.buildDashboardPayload(competitionId)
    const cacheKey = getDashboardCacheKey(competitionId)
    const cached = await cacheRepository.setCache(cacheKey, payload, {
      source: 'upstream-manual-refresh',
      status: 'ok',
    })

    response.json({
      refreshed: true,
      stale: false,
      cache: {
        key: cached.key,
        updatedAt: cached.updatedAt,
      },
      payload,
    })
  } catch (error) {
    const cacheKey = getDashboardCacheKey(competitionId)
    const staleCache = await cacheRepository.getCache(cacheKey)

    if (staleCache) {
      response.json({
        refreshed: false,
        stale: true,
        cache: {
          key: staleCache.key,
          updatedAt: staleCache.updatedAt,
        },
        payload: staleCache.payload,
        warning:
          'No se pudo refrescar desde TheSportsDB. Se devuelve el último dato cacheado disponible.',
      })
      return
    }

    if (error instanceof TheSportsDbClientError) {
      if (error.code === 'UPSTREAM_TIMEOUT') {
        response.status(504).json({ error: error.message, code: error.code })
        return
      }

      response.status(502).json({ error: error.message, code: error.code, upstreamStatus: error.status })
      return
    }

    response.status(500).json({ error: 'Unexpected backend error' })
  }
})

// Esta ruta devuelve detalle de competición desde cache y solo usa API externa si no hay entrada guardada.
app.get('/api/competition/:competitionId', async (request, response) => {
  const competitionId = request.params.competitionId

  if (!competitionId) {
    response.status(400).json({ error: 'competitionId is required' })
    return
  }

  try {
    const payload = await getOrSetCachePayload(getCompetitionCacheKey(competitionId), () =>
      competitionService.buildCompetitionPayload(competitionId),
    )
    response.json(payload)
  } catch (error) {
    sendUpstreamError(response, error)
  }
})

// Esta ruta devuelve eventos de temporada con la misma lógica cache-first.
app.get('/api/season-events/:competitionId/:seasonYear', async (request, response) => {
  const competitionId = request.params.competitionId
  const seasonYear = request.params.seasonYear

  if (!competitionId) {
    response.status(400).json({ error: 'competitionId is required' })
    return
  }

  if (!seasonYear) {
    response.status(400).json({ error: 'seasonYear is required' })
    return
  }

  try {
    const payload = await getOrSetCachePayload(getSeasonEventsCacheKey(competitionId, seasonYear), () =>
      seasonService.buildSeasonEventsPayload(competitionId, seasonYear),
    )
    response.json(payload)
  } catch (error) {
    sendUpstreamError(response, error)
  }
})

// Esta ruta devuelve el detalle de evento por ID.
app.get('/api/event/:eventId', async (request, response) => {
  const eventId = request.params.eventId

  if (!eventId) {
    response.status(400).json({ error: 'eventId is required' })
    return
  }

  try {
    const payload = await getOrSetCachePayload(getEventCacheKey(eventId), () =>
      eventService.buildEventDetailsPayload(eventId),
    )
    response.json(payload)
  } catch (error) {
    sendUpstreamError(response, error)
  }
})

// Esta ruta devuelve todos los equipos de una competición.
app.get('/api/teams/:competitionId', async (request, response) => {
  const competitionId = request.params.competitionId

  if (!competitionId) {
    response.status(400).json({ error: 'competitionId is required' })
    return
  }

  try {
    const payload = await getOrSetCachePayload(getTeamsCacheKey(competitionId), () =>
      teamService.buildTeamsPayload(competitionId),
    )
    response.json(payload)
  } catch (error) {
    sendUpstreamError(response, error)
  }
})

// Esta ruta devuelve un equipo concreto usando la colección cacheada de equipos de la competición.
app.get('/api/team/:competitionId/:teamId', async (request, response) => {
  const competitionId = request.params.competitionId
  const teamId = request.params.teamId

  if (!competitionId) {
    response.status(400).json({ error: 'competitionId is required' })
    return
  }

  if (!teamId) {
    response.status(400).json({ error: 'teamId is required' })
    return
  }

  try {
    const teams = await getOrSetCachePayload(getTeamsCacheKey(competitionId), () =>
      teamService.buildTeamsPayload(competitionId),
    )
    const payload = teams.find((team) => team.id === Number(teamId)) ?? null

    response.json(payload)
  } catch (error) {
    sendUpstreamError(response, error)
  }
})

// Esta ruta devuelve los pilotos de un equipo concreto.
app.get('/api/team-drivers/:teamId', async (request, response) => {
  const teamId = request.params.teamId

  if (!teamId) {
    response.status(400).json({ error: 'teamId is required' })
    return
  }

  try {
    const payload = await getOrSetCachePayload(getTeamDriversCacheKey(teamId), () =>
      driverService.buildTeamDriversPayload(teamId),
    )
    response.json(payload)
  } catch (error) {
    sendUpstreamError(response, error)
  }
})

// Esta ruta devuelve detalle de un piloto por su ID.
app.get('/api/driver/:driverId', async (request, response) => {
  const driverId = request.params.driverId

  if (!driverId) {
    response.status(400).json({ error: 'driverId is required' })
    return
  }

  try {
    const payload = await getOrSetCachePayload(getDriverCacheKey(driverId), () =>
      driverService.buildDriverPayload(driverId),
    )
    response.json(payload)
  } catch (error) {
    sendUpstreamError(response, error)
  }
})

// Primero inicializa la BD y el repositorio, y solo después expone el servidor HTTP.
const startServer = async () => {
  const db = await initCacheDb()
  cacheRepository = createCacheRepository(db)
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('[server] failed to start', error)
})
