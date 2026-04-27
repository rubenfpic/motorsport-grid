import { mount, flushPromises } from '@vue/test-utils'
import { computed, defineComponent, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { EventDetails } from '@/types'
import { useEventDetails } from './useEventDetails'

const mockGetEventById = vi.fn()

vi.mock('@/services/event.service', () => {
  class EventServiceMock {
    getEventById = mockGetEventById
  }

  return {
    default: EventServiceMock,
  }
})

const buildEventDetails = (id: string, name: string): EventDetails => ({
  id,
  name,
  season: '2026',
  venue: 'Circuit',
  city: 'City',
  country: 'Country',
  date: '2026-01-01',
  poster: null,
  video: null,
  result: [],
})

describe('useEventDetails', () => {
  beforeEach(() => {
    mockGetEventById.mockReset()
  })

  it('carga detalles al montar el composable', async () => {
    const details = buildEventDetails('101', 'Event 101')
    mockGetEventById.mockResolvedValue(details)

    const eventId = ref('101')
    let composableState!: ReturnType<typeof useEventDetails>

    const Harness = defineComponent({
      template: '<div />',
      setup() {
        composableState = useEventDetails(computed(() => eventId.value))
      },
    })

    const wrapper = mount(Harness)
    await flushPromises()

    expect(mockGetEventById).toHaveBeenCalledTimes(1)
    expect(mockGetEventById).toHaveBeenCalledWith('101')
    expect(composableState.eventDetails.value).toEqual(details)
    expect(composableState.eventDetailsError.value).toBeNull()
    expect(composableState.isEventDetailsLoading.value).toBe(false)

    wrapper.unmount()
  })

  it('expone estado de error cuando falla la carga', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockGetEventById.mockRejectedValue(new Error('Network error'))

    const eventId = ref('102')
    let composableState!: ReturnType<typeof useEventDetails>

    const Harness = defineComponent({
      template: '<div />',
      setup() {
        composableState = useEventDetails(computed(() => eventId.value))
      },
    })

    const wrapper = mount(Harness)
    await flushPromises()

    expect(mockGetEventById).toHaveBeenCalledTimes(1)
    expect(composableState.eventDetails.value).toBeNull()
    expect(composableState.eventDetailsError.value).toBe(
      'No se pudieron cargar los detalles del evento.',
    )
    expect(composableState.isEventDetailsLoading.value).toBe(false)
    expect(errorSpy).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('vuelve a cargar cuando cambia eventId', async () => {
    const firstDetails = buildEventDetails('201', 'Event 201')
    const secondDetails = buildEventDetails('202', 'Event 202')
    mockGetEventById.mockResolvedValueOnce(firstDetails).mockResolvedValueOnce(secondDetails)

    const eventId = ref('201')
    let composableState!: ReturnType<typeof useEventDetails>

    const Harness = defineComponent({
      template: '<div />',
      setup() {
        composableState = useEventDetails(computed(() => eventId.value))
      },
    })

    const wrapper = mount(Harness)
    await flushPromises()

    eventId.value = '202'
    await flushPromises()

    expect(mockGetEventById).toHaveBeenCalledTimes(2)
    expect(mockGetEventById).toHaveBeenNthCalledWith(1, '201')
    expect(mockGetEventById).toHaveBeenNthCalledWith(2, '202')
    expect(composableState.eventDetails.value).toEqual(secondDetails)
    expect(composableState.eventDetailsError.value).toBeNull()

    wrapper.unmount()
  })
})
