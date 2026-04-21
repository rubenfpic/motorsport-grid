import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { CurrentStandings } from '@/types'
import CurrentStandingsCard from './CurrentStandingsCard.vue'

const buildStandings = (entriesCount: number): CurrentStandings => ({
  sourceEventId: 'event-1',
  sourceEventName: 'Event Name',
  sourceDate: '2026-01-01',
  entries: Array.from({ length: entriesCount }, (_, index) => ({
    position: index + 1,
    driver: `Driver ${index + 1}`,
    team: `Team ${index + 1}`,
    pointsRaw: String((entriesCount - index) * 10),
    points: String((entriesCount - index) * 10),
  })),
})

describe('CurrentStandingsCard', () => {
  it('muestra estado de carga', () => {
    const wrapper = mount(CurrentStandingsCard, {
      props: {
        currentStandings: null,
        currentStandingsError: null,
        isCurrentStandingsLoading: true,
      },
    })

    expect(wrapper.text()).toContain('Loading...')
    expect(wrapper.find('p[aria-busy="true"]').exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('muestra estado de error', () => {
    const wrapper = mount(CurrentStandingsCard, {
      props: {
        currentStandings: null,
        currentStandingsError: 'Any error',
        isCurrentStandingsLoading: false,
      },
    })

    expect(wrapper.text()).toContain('Could not load the current standings.')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('muestra 5 filas por defecto y alterna a todas las filas al pulsar el botón', async () => {
    const wrapper = mount(CurrentStandingsCard, {
      props: {
        currentStandings: buildStandings(8),
        currentStandingsError: null,
        isCurrentStandingsLoading: false,
      },
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(5)
    expect(wrapper.get('button').text()).toBe('See all')

    await wrapper.get('button').trigger('click')

    expect(wrapper.findAll('tbody tr')).toHaveLength(8)
    expect(wrapper.get('button').text()).toBe('See top 5')
  })
})
