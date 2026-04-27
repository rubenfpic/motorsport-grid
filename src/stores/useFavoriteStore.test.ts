import { AVAILABLE_LEAGUES } from '@/constants/api'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCompetitionStore } from './useCompetitionStore'
import { useFavoriteStore } from './useFavoriteStore'

describe('useFavoriteStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('setFavoriteTeam guarda el favorito en estado y localStorage con la key de competición activa', () => {
    const competitionStore = useCompetitionStore()
    const favoriteStore = useFavoriteStore()

    competitionStore.competitionId = AVAILABLE_LEAGUES[0]!
    favoriteStore.setFavoriteTeam(148152)

    expect(favoriteStore.favoriteTeamId).toBe(148152)
    expect(localStorage.getItem(`favoriteTeamId:${AVAILABLE_LEAGUES[0]}`)).toBe('148152')
  })

  it('clearFavoriteTeam limpia estado y localStorage para la competición activa', () => {
    const competitionStore = useCompetitionStore()
    const favoriteStore = useFavoriteStore()

    competitionStore.competitionId = AVAILABLE_LEAGUES[0]!
    favoriteStore.setFavoriteTeam(148152)

    favoriteStore.clearFavoriteTeam()

    expect(favoriteStore.favoriteTeamId).toBeNull()
    expect(localStorage.getItem(`favoriteTeamId:${AVAILABLE_LEAGUES[0]}`)).toBeNull()
  })

  it('hydrateFavoriteTeam no cambia nada si no hay valor guardado', () => {
    const competitionStore = useCompetitionStore()
    const favoriteStore = useFavoriteStore()

    competitionStore.competitionId = AVAILABLE_LEAGUES[0]!

    favoriteStore.hydrateFavoriteTeam()

    expect(favoriteStore.favoriteTeamId).toBeNull()
  })

  it('hydrateFavoriteTeam recupera valor válido desde localStorage', () => {
    const competitionStore = useCompetitionStore()
    const favoriteStore = useFavoriteStore()
    const competitionId = AVAILABLE_LEAGUES[1]!

    competitionStore.competitionId = competitionId
    localStorage.setItem(`favoriteTeamId:${competitionId}`, '20001')

    favoriteStore.hydrateFavoriteTeam()

    expect(favoriteStore.favoriteTeamId).toBe(20001)
  })

  it('hydrateFavoriteTeam elimina valor inválido y deja estado limpio', () => {
    const competitionStore = useCompetitionStore()
    const favoriteStore = useFavoriteStore()
    const competitionId = AVAILABLE_LEAGUES[1]!
    const removeSpy = vi.spyOn(Storage.prototype, 'removeItem')

    competitionStore.competitionId = competitionId
    localStorage.setItem(`favoriteTeamId:${competitionId}`, 'abc')

    favoriteStore.hydrateFavoriteTeam()

    expect(favoriteStore.favoriteTeamId).toBeNull()
    expect(removeSpy).toHaveBeenCalledWith(`favoriteTeamId:${competitionId}`)
    expect(localStorage.getItem(`favoriteTeamId:${competitionId}`)).toBeNull()
  })

  it('isFavoriteTeam devuelve true solo para el equipo favorito actual', () => {
    const competitionStore = useCompetitionStore()
    const favoriteStore = useFavoriteStore()

    competitionStore.competitionId = AVAILABLE_LEAGUES[0]!
    favoriteStore.setFavoriteTeam(999)

    expect(favoriteStore.isFavoriteTeam(999)).toBe(true)
    expect(favoriteStore.isFavoriteTeam(1000)).toBe(false)
  })

  it('usa una key distinta por competición y permite hidratar cada favorita al cambiar de liga', () => {
    const competitionStore = useCompetitionStore()
    const favoriteStore = useFavoriteStore()
    const competitionA = AVAILABLE_LEAGUES[0]!
    const competitionB = AVAILABLE_LEAGUES[1]!

    competitionStore.competitionId = competitionA
    favoriteStore.setFavoriteTeam(111)

    competitionStore.competitionId = competitionB
    favoriteStore.setFavoriteTeam(222)

    expect(localStorage.getItem(`favoriteTeamId:${competitionA}`)).toBe('111')
    expect(localStorage.getItem(`favoriteTeamId:${competitionB}`)).toBe('222')

    favoriteStore.favoriteTeamId = null
    competitionStore.competitionId = competitionA
    favoriteStore.hydrateFavoriteTeam()
    expect(favoriteStore.favoriteTeamId).toBe(111)

    competitionStore.competitionId = competitionB
    favoriteStore.hydrateFavoriteTeam()
    expect(favoriteStore.favoriteTeamId).toBe(222)
  })
})
