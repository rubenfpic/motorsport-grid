const serializeCacheRow = (row) => ({
  key: row.key,
  payload: JSON.parse(row.payload),
  updatedAt: row.updated_at,
  source: row.source,
  status: row.status,
})

export const createCacheRepository = (db) => {
  const getCache = async (key) => {
    const row = await db.get(
      'SELECT key, payload, updated_at, source, status FROM cache_entries WHERE key = ?',
      [key],
    )

    if (!row) return null
    return serializeCacheRow(row)
  }

  const setCache = async (key, payload, { source = 'manual', status = 'ok' } = {}) => {
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
      [key, payloadJson, updatedAt, String(source), String(status)],
    )

    return getCache(key)
  }

  return {
    getCache,
    setCache,
  }
}
