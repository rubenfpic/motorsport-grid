import { AVAILABLE_LEAGUES } from '@/constants/api'
import { useCompetitionStore } from '@/stores/useCompetitionStore'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CurrentStandings, NextEvent, PastEvent } from '@/types'
import { useDashboard } from './useDashboard'

const mockGetNextEvent = vi.fn()
const mockGetPastEvent = vi.fn()
const mockGetCurrentStandings = vi.fn()

vi.mock('@/services/dashboard.service', () => {
  class DashboardServiceMock {
    getNextEvent = mockGetNextEvent
    getPastEvent = mockGetPastEvent
    getCurrentStandings = mockGetCurrentStandings
  }

  return {
    DashboardService: DashboardServiceMock,
  }
})

const buildNextEvent = (id: string, name: string): NextEvent => ({
  id,
  name,
  venue: 'Circuit',
  city: 'City',
  country: 'Country',
  date: '2026-01-01',
  season: '2026',
})

const buildPastEvent = (id: string, name: string): PastEvent => ({
  id,
  name,
  venue: 'Circuit',
  city: 'City',
  country: 'Country',
  date: '2026-01-02',
  season: '2026',
  podium: [],
})

const buildCurrentStandings = (sourceEventId: string): CurrentStandings => ({
  sourceEventId,
  sourceEventName: 'Race source',
  sourceDate: '2026-01-02',
  entries: [
    {
      position: 1,
      driver: 'Driver 1',
      team: 'Team 1',
      pointsRaw: '100',
      points: '100',
    },
  ],
})

describe('useDashboard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockGetNextEvent.mockReset()
    mockGetPastEvent.mockReset()
    mockGetCurrentStandings.mockReset()
  })

  it('carga next/past/current standings al montar', async () => {
    const nextEvent = buildNextEvent('n-1', 'Next race')
    const pastEvent = buildPastEvent('p-1', 'Past race')
    const currentStandings = buildCurrentStandings('p-1')

    mockGetNextEvent.mockResolvedValue(nextEvent)
    mockGetPastEvent.mockResolvedValue(pastEvent)
    mockGetCurrentStandings.mockResolvedValue(currentStandings)

    let composableState!: ReturnType<typeof useDashboard>
    const Harness = defineComponent({
      template: '<div />',
      setup() {
        composableState = useDashboard()
      },
    })

    const wrapper = mount(Harness)
    await flushPromises()

    expect(mockGetNextEvent).toHaveBeenCalledTimes(1)
    expect(mockGetPastEvent).toHaveBeenCalledTimes(1)
    expect(mockGetCurrentStandings).toHaveBeenCalledTimes(1)

    expect(composableState.nextEvent.value).toEqual(nextEvent)
    expect(composableState.pastEvent.value).toEqual(pastEvent)
    expect(composableState.currentStandings.value).toEqual(currentStandings)
    expect(composableState.nextEventError.value).toBeNull()
    expect(composableState.pastEventError.value).toBeNull()
    expect(composableState.currentStandingsError.value).toBeNull()
    expect(composableState.isNextEventLoading.value).toBe(false)
    expect(composableState.isPastEventLoading.value).toBe(false)
    expect(composableState.isCurrentStandingsLoading.value).toBe(false)

    wrapper.unmount()
  })

  it('maneja error parcial cuando falla nextEvent y mantiene el resto de secciones', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const pastEvent = buildPastEvent('p-2', 'Past race 2')
    const currentStandings = buildCurrentStandings('p-2')

    mockGetNextEvent.mockRejectedValue(new Error('Next event failed'))
    mockGetPastEvent.mockResolvedValue(pastEvent)
    mockGetCurrentStandings.mockResolvedValue(currentStandings)

    let composableState!: ReturnType<typeof useDashboard>
    const Harness = defineComponent({
      template: '<div />',
      setup() {
        composableState = useDashboard()
      },
    })

    const wrapper = mount(Harness)
    await flushPromises()

    expect(composableState.nextEvent.value).toBeNull()
    expect(composableState.nextEventError.value).toBe('Could not load the next race.')
    expect(composableState.pastEvent.value).toEqual(pastEvent)
    expect(composableState.currentStandings.value).toEqual(currentStandings)
    expect(composableState.pastEventError.value).toBeNull()
    expect(composableState.currentStandingsError.value).toBeNull()
    expect(composableState.isNextEventLoading.value).toBe(false)
    expect(composableState.isPastEventLoading.value).toBe(false)
    expect(composableState.isCurrentStandingsLoading.value).toBe(false)
    expect(errorSpy).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('recarga dashboard cuando cambia la competición activa', async () => {
    const competitionStore = useCompetitionStore()
    const nextEventA = buildNextEvent('n-a', 'Next race A')
    const nextEventB = buildNextEvent('n-b', 'Next race B')
    const pastEventA = buildPastEvent('p-a', 'Past race A')
    const pastEventB = buildPastEvent('p-b', 'Past race B')
    const currentStandingsA = buildCurrentStandings('p-a')
    const currentStandingsB = buildCurrentStandings('p-b')

    mockGetNextEvent.mockResolvedValueOnce(nextEventA).mockResolvedValueOnce(nextEventB)
    mockGetPastEvent.mockResolvedValueOnce(pastEventA).mockResolvedValueOnce(pastEventB)
    mockGetCurrentStandings
      .mockResolvedValueOnce(currentStandingsA)
      .mockResolvedValueOnce(currentStandingsB)

    let composableState!: ReturnType<typeof useDashboard>
    const Harness = defineComponent({
      template: '<div />',
      setup() {
        composableState = useDashboard()
      },
    })

    const wrapper = mount(Harness)
    await flushPromises()

    competitionStore.competitionId = AVAILABLE_LEAGUES[1]!
    await flushPromises()

    expect(mockGetNextEvent).toHaveBeenCalledTimes(2)
    expect(mockGetPastEvent).toHaveBeenCalledTimes(2)
    expect(mockGetCurrentStandings).toHaveBeenCalledTimes(2)
    expect(composableState.nextEvent.value).toEqual(nextEventB)
    expect(composableState.pastEvent.value).toEqual(pastEventB)
    expect(composableState.currentStandings.value).toEqual(currentStandingsB)

    wrapper.unmount()
  })
})
