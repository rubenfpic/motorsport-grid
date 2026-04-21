import { AVAILABLE_LEAGUES, LEAGUE_ID } from '@/constants/api'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCompetitionStore } from './useCompetitionStore'

describe('useCompetitionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
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
})
