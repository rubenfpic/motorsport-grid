import express from 'express'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

const app = express()
const PORT = 3000
const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DB_PATH = join(DATA_DIR, 'cache.db')

let db

const initCacheDb = async () => {
  mkdirSync(DATA_DIR, { recursive: true })

  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cache_entries (
      key TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `)
}

const serializeCacheRow = (row) => ({
  key: row.key,
  payload: JSON.parse(row.payload),
  updatedAt: row.updated_at,
  source: row.source,
  status: row.status,
})

app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'motorsport-grid-backend',
    dbPath: DB_PATH,
    timestamp: new Date().toISOString(),
  })
})

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

  const updatedAt = new Date().toISOString()
  const payloadJson = JSON.stringify(payload)

  await db.run(
    `
      INSERT INTO cache_entries (key, payload, updated_at, source, status)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        payload = excluded.payload,
        updated_at = excluded.updated_at,
        source = excluded.source,
        status = excluded.status
    `,
    [cacheKey, payloadJson, updatedAt, String(source), String(status)],
  )

  const row = await db.get('SELECT key, payload, updated_at, source, status FROM cache_entries WHERE key = ?', [
    cacheKey,
  ])

  response.json(serializeCacheRow(row))
})

app.get('/api/cache/:key', async (request, response) => {
  const cacheKey = request.params.key
  const row = await db.get('SELECT key, payload, updated_at, source, status FROM cache_entries WHERE key = ?', [
    cacheKey,
  ])

  if (!row) {
    response.status(404).json({ error: 'cache entry not found' })
    return
  }

  response.json(serializeCacheRow(row))
})

const startServer = async () => {
  await initCacheDb()
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('[server] failed to start', error)
})
