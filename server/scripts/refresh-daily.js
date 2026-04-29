import { TheSportsDbClient, TheSportsDbClientError } from '../clients/the-sports-db-client.js'
import { initCacheDb } from '../db/cache-db.js'
import { createCacheRepository } from '../repositories/cache-repository.js'
import { CompetitionService } from '../services/competition-service.js'
import { DashboardService } from '../services/dashboard-service.js'
import { SeasonService } from '../services/season-service.js'
import { TeamService } from '../services/team-service.js'

// Valores por defecto para ejecutar el refresco diario sin depender de variables de entorno.
const DEFAULT_COMPETITIONS = ['4438', '4409', '4372', '4412']
const DEFAULT_SEASONS = [String(new Date().getUTCFullYear())]
const DEFAULT_PAUSE_MS = 400
const RATE_LIMIT_RETRY_WAIT_MS = 65_000

// Convierte variables tipo CSV en arrays útiles y aplica fallback cuando vienen vacías.
const parseCsvEnv = (value, fallback) => {
  if (!value) return fallback
  const parsed = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return parsed.length ? parsed : fallback
}

// Pausa intencionada entre llamadas para no saturar la API gratuita.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Escribe payload en cache con trazabilidad del origen del refresco.
const cacheWithTrace = async (cacheRepository, key, payload, source) => {
  const row = await cacheRepository.setCache(key, payload, {
    source,
    status: 'ok',
  })
  return row
}

// Identifica de forma centralizada el caso de límite de peticiones (HTTP 429).
const isRateLimitError = (error) =>
  error instanceof TheSportsDbClientError &&
  error.code === 'UPSTREAM_HTTP_ERROR' &&
  error.status === 429

// Gestiona fallos de refresco: si hay 429 y existe cache previa, conserva stale y continúa.
const handleRefreshError = async ({
  cacheRepository,
  cacheKey,
  competitionId,
  error,
  failures,
  seasonYear,
  step,
}) => {
  if (isRateLimitError(error)) {
    const staleCache = await cacheRepository.getCache(cacheKey)
    if (staleCache) {
      console.warn(
        `[refresh] ${step} rate-limited (${competitionId}${seasonYear ? `/${seasonYear}` : ''}), keeping stale cache`,
      )
      return
    }
  }

  failures.push({ step, competitionId, seasonYear, error })
  console.error(
    `[refresh] ${step} failed (${competitionId}${seasonYear ? `/${seasonYear}` : ''})`,
    error,
  )
}

// Reintenta una vez tras esperar cuando el upstream responde con rate limit.
const runWithRateLimitRetry = async (task, label) => {
  try {
    return await task()
  } catch (error) {
    const isRateLimitError =
      error instanceof TheSportsDbClientError &&
      error.code === 'UPSTREAM_HTTP_ERROR' &&
      error.status === 429

    if (!isRateLimitError) throw error

    console.warn(`[refresh] rate limit in ${label}, waiting 65s before retry`)
    await sleep(RATE_LIMIT_RETRY_WAIT_MS)
    return task()
  }
}

// Orquesta el refresco diario de recursos clave y persiste resultados en SQLite.
const main = async () => {
  const competitions = parseCsvEnv(process.env.REFRESH_COMPETITIONS, DEFAULT_COMPETITIONS)
  const seasons = parseCsvEnv(process.env.REFRESH_SEASONS, DEFAULT_SEASONS)
  const pauseMs = Number(process.env.REFRESH_PAUSE_MS ?? DEFAULT_PAUSE_MS)

  const db = await initCacheDb()
  const cacheRepository = createCacheRepository(db)
  const client = new TheSportsDbClient()
  const competitionService = new CompetitionService(client)
  const dashboardService = new DashboardService(client)
  const seasonService = new SeasonService(client)
  const teamService = new TeamService(client)

  const failures = []

  console.log('[refresh] start', {
    competitions,
    seasons,
    pauseMs,
    at: new Date().toISOString(),
  })

  for (const competitionId of competitions) {
    try {
      const competitionPayload = await runWithRateLimitRetry(
        () => competitionService.buildCompetitionPayload(competitionId),
        `competition:${competitionId}`,
      )
      const cacheKey = `competition:${competitionId}`
      await cacheWithTrace(
        cacheRepository,
        cacheKey,
        competitionPayload,
        'cron-refresh',
      )
      console.log(`[refresh] competition ok (${competitionId})`)
    } catch (error) {
      await handleRefreshError({
        cacheRepository,
        cacheKey: `competition:${competitionId}`,
        competitionId,
        error,
        failures,
        step: 'competition',
      })
    }

    await sleep(pauseMs)

    try {
      const dashboardPayload = await runWithRateLimitRetry(
        () => dashboardService.buildDashboardPayload(competitionId),
        `dashboard:${competitionId}`,
      )
      const cacheKey = `dashboard:${competitionId}`
      await cacheWithTrace(
        cacheRepository,
        cacheKey,
        dashboardPayload,
        'cron-refresh',
      )
      console.log(`[refresh] dashboard ok (${competitionId})`)
    } catch (error) {
      await handleRefreshError({
        cacheRepository,
        cacheKey: `dashboard:${competitionId}`,
        competitionId,
        error,
        failures,
        step: 'dashboard',
      })
    }

    await sleep(pauseMs)

    try {
      const teamsPayload = await runWithRateLimitRetry(
        () => teamService.buildTeamsPayload(competitionId),
        `teams:${competitionId}`,
      )
      const cacheKey = `teams:${competitionId}`
      await cacheWithTrace(cacheRepository, cacheKey, teamsPayload, 'cron-refresh')
      console.log(`[refresh] teams ok (${competitionId})`)
    } catch (error) {
      await handleRefreshError({
        cacheRepository,
        cacheKey: `teams:${competitionId}`,
        competitionId,
        error,
        failures,
        step: 'teams',
      })
    }

    for (const seasonYear of seasons) {
      await sleep(pauseMs)
      try {
        const seasonPayload = await runWithRateLimitRetry(
          () => seasonService.buildSeasonEventsPayload(competitionId, seasonYear),
          `season-events:${competitionId}:${seasonYear}`,
        )
        const cacheKey = `season-events:${competitionId}:${seasonYear}`
        await cacheWithTrace(
          cacheRepository,
          cacheKey,
          seasonPayload,
          'cron-refresh',
        )
        console.log(`[refresh] season-events ok (${competitionId}/${seasonYear})`)
      } catch (error) {
        await handleRefreshError({
          cacheRepository,
          cacheKey: `season-events:${competitionId}:${seasonYear}`,
          competitionId,
          error,
          failures,
          seasonYear,
          step: 'season-events',
        })
      }
    }
  }

  // Cierre explícito de la conexión SQLite al terminar todas las operaciones.
  await db.close()

  // Si hubo fallos no recuperados, marcamos exit code 1 para que cron/CI lo detecte.
  if (failures.length > 0) {
    console.error(`[refresh] completed with ${failures.length} failure(s)`)
    process.exitCode = 1
    return
  }

  console.log('[refresh] completed successfully')
}

// Captura de seguridad para fallos no controlados en el flujo principal.
main().catch((error) => {
  console.error('[refresh] unexpected fatal error', error)
  process.exitCode = 1
})
