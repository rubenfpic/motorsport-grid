import express from 'express'
import { DB_PATH, initCacheDb } from './db/cache-db.js'
import { createCacheRepository } from './repositories/cache-repository.js'

const app = express()
const PORT = 3000
let cacheRepository

app.use(express.json())

// RUTA: Este endpoint sirve para comprobar rápidamente que el backend está vivo y conectado a su configuración básica.
app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'motorsport-grid-backend',
    dbPath: DB_PATH,
    timestamp: new Date().toISOString(),
  })
})

// RUTA: Esta ruta guarda o actualiza en SQLite el JSON asociado a una clave de cache concreta.
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

  // ACCESO A DATOS: La escritura se delega al repositorio para no mezclar SQL con la capa HTTP.
  const row = await cacheRepository.setCache(cacheKey, payload, {
    source,
    status,
  })

  response.json(row)
})

// RUTA: Esta ruta devuelve la entrada de cache de una clave concreta si existe en la base de datos.
app.get('/api/cache/:key', async (request, response) => {
  const cacheKey = request.params.key
  const row = await cacheRepository.getCache(cacheKey)

  if (!row) {
    response.status(404).json({ error: 'cache entry not found' })
    return
  }

  response.json(row)
})

// ARRANQUE: Primero inicializa la BD y el repositorio, y solo después expone el servidor HTTP.
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
