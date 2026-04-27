import { AVAILABLE_LEAGUES, LEAGUE_ID } from '@/constants/api'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Competition } from '@/types'

import { useCompetitionStore } from './useCompetitionStore'

const { mockGetCompetitionById } = vi.hoisted(() => ({
  mockGetCompetitionById: vi.fn(),
}))

vi.mock('@/services/competition.service', () => {
  class CompetitionServiceMock {
    getCompetitionById = mockGetCompetitionById
  }

  return {
    CompetitionService: CompetitionServiceMock,
  }
})

const buildCompetition = (
  id: string,
  name: string,
  badge: string | null = null,
): Competition => ({
  id,
  name,
  sport: null,
  country: null,
  currentSeason: null,
  logo: null,
  badge,
  poster: null,
})

describe('useCompetitionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    mockGetCompetitionById.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('hydrateCompetition mantiene la liga por defecto si no hay valor guardado', () => {
    const store = useCompetitionStore()

    store.hydrateCompetition()

    expect(store.competitionId).toBe(LEAGUE_ID)
  })

  it('hydrateCompetition carga una liga válida desde localStorage', () => {
    const store = useCompetitionStore()
    const targetCompetition = AVAILABLE_LEAGUES[1]!
    localStorage.setItem('competitionId', targetCompetition)

    store.hydrateCompetition()

    expect(store.competitionId).toBe(targetCompetition)
  })

  it('hydrateCompetition elimina liga inválida de localStorage', () => {
    const store = useCompetitionStore()
    const removeSpy = vi.spyOn(Storage.prototype, 'removeItem')
    localStorage.setItem('competitionId', '9999')

    store.hydrateCompetition()

    expect(removeSpy).toHaveBeenCalledWith('competitionId')
    expect(localStorage.getItem('competitionId')).toBeNull()
    expect(store.competitionId).toBe(LEAGUE_ID)
  })

  it('setCompetitionId ignora una liga inválida', async () => {
    const store = useCompetitionStore()
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    const loadMetaSpy = vi.spyOn(store, 'loadCompetitionMeta')

    await store.setCompetitionId('9999')

    expect(store.competitionId).toBe(LEAGUE_ID)
    expect(setItemSpy).not.toHaveBeenCalled()
    expect(loadMetaSpy).not.toHaveBeenCalled()
  })

  it('setCompetitionId guarda liga válida y llama a loadCompetitionMeta', async () => {
    const store = useCompetitionStore()
    const targetCompetition = AVAILABLE_LEAGUES[1]!
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    const loadMetaSpy = vi.spyOn(store, 'loadCompetitionMeta').mockResolvedValue()

    await store.setCompetitionId(targetCompetition)

    expect(store.competitionId).toBe(targetCompetition)
    expect(setItemSpy).toHaveBeenCalledWith('competitionId', targetCompetition)
    expect(loadMetaSpy).toHaveBeenCalledTimes(1)
  })

  it('loadCompetitionMeta carga el nombre de la competición activa', async () => {
    const store = useCompetitionStore()
    const targetCompetition = AVAILABLE_LEAGUES[1]!

    store.competitionId = targetCompetition
    mockGetCompetitionById.mockResolvedValue(buildCompetition(targetCompetition, 'WEC'))

    await store.loadCompetitionMeta()

    expect(mockGetCompetitionById).toHaveBeenCalledWith(targetCompetition)
    expect(store.competitionName).toBe('WEC')
  })

  it('loadCompetitionMeta deja el nombre vacío si el servicio falla', async () => {
    const store = useCompetitionStore()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    store.competitionName = 'OLD NAME'
    mockGetCompetitionById.mockRejectedValue(new Error('boom'))

    await store.loadCompetitionMeta()

    expect(store.competitionName).toBe('')
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  it('loadAvailableCompetitionsMeta rellena metadatos con datos reales y fallback por id', async () => {
    const store = useCompetitionStore()
    const [leagueA, leagueB, leagueC, leagueD] = AVAILABLE_LEAGUES
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    mockGetCompetitionById.mockImplementation(async (competitionId: string) => {
      if (competitionId === leagueA) return buildCompetition(leagueA!, 'DTM', 'dtm-badge.png')
      if (competitionId === leagueB) return buildCompetition(leagueB!, 'WRC', null)
      if (competitionId === leagueC) return null
      throw new Error('service unavailable')
    })

    await store.loadAvailableCompetitionsMeta()

    expect(mockGetCompetitionById).toHaveBeenCalledTimes(AVAILABLE_LEAGUES.length)
    expect(store.availableCompetitionsMeta[leagueA!]).toEqual({
      name: 'DTM',
      badge: 'dtm-badge.png',
    })
    expect(store.availableCompetitionsMeta[leagueB!]).toEqual({
      name: 'WRC',
      badge: null,
    })
    expect(store.availableCompetitionsMeta[leagueC!]).toEqual({
      name: leagueC!,
      badge: null,
    })
    expect(store.availableCompetitionsMeta[leagueD!]).toEqual({
      name: leagueD!,
      badge: null,
    })
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })
})
