const DEFAULT_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/'
const DEFAULT_API_KEY = '123'
const DEFAULT_TIMEOUT_MS = 8_000

// Clase de error propia para unificar cómo reportamos fallos del servicio externo.
export class TheSportsDbClientError extends Error {
  constructor(message, { code, status } = {}) {
    super(message)
    this.name = 'TheSportsDbClientError'
    this.code = code ?? 'UPSTREAM_UNKNOWN_ERROR'
    this.status = status ?? null
  }
}

export class TheSportsDbClient {
  constructor({
    baseUrl = DEFAULT_BASE_URL,
    apiKey = DEFAULT_API_KEY,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = {}) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
    this.timeoutMs = timeoutMs
  }

  // Construye la URL final del endpoint y añade query params válidos.
  buildUrl(endpoint, query = {}) {
    const base = `${this.baseUrl}${this.apiKey}/${endpoint}`
    const url = new URL(base)

    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      url.searchParams.set(key, String(value))
    })

    return url
  }

  // Ejecuta fetch con timeout y transforma errores de red/HTTP/JSON en errores tipados.
  async request(endpoint, query = {}) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const url = this.buildUrl(endpoint, query)
      const response = await fetch(url, { signal: controller.signal })

      if (!response.ok) {
        throw new TheSportsDbClientError(
          `TheSportsDB devolvió HTTP ${response.status} para ${endpoint}`,
          { code: 'UPSTREAM_HTTP_ERROR', status: response.status },
        )
      }

      try {
        return await response.json()
      } catch {
        throw new TheSportsDbClientError('TheSportsDB devolvió una respuesta no JSON', {
          code: 'UPSTREAM_INVALID_JSON',
        })
      }
    } catch (error) {
      if (error instanceof TheSportsDbClientError) {
        throw error
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new TheSportsDbClientError('TheSportsDB agotó el tiempo de espera', {
          code: 'UPSTREAM_TIMEOUT',
        })
      }

      throw new TheSportsDbClientError('No se pudo conectar con TheSportsDB', {
        code: 'UPSTREAM_NETWORK_ERROR',
      })
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // Consulta el detalle de competición por ID usando el endpoint oficial.
  async getCompetitionById(competitionId) {
    return this.request('lookupleague.php', { id: competitionId })
  }
}
