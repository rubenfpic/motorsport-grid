import EventService from '@/services/event.service'
import type { EventDetails } from '@/types/event-details.type'
import { onMounted, ref, watch, type ComputedRef } from 'vue'

export function useEventData(eventId: ComputedRef<string>) {
  const eventDetails = ref<EventDetails | null>(null)
  const eventDetailsError = ref<string | null>(null)
  const isLoading = ref(true)
  const eventService = new EventService()

  const loadSeasonEventData = async () => {
    eventDetailsError.value = null
    isLoading.value = true

    try {
      eventDetails.value = await eventService.getEventDetails(eventId.value)
    } catch (error) {
      console.error('Error al cargar los detalles del evento:', error)
      eventDetailsError.value = 'No se pudieron cargar los detalles del evento.'
    } finally {
      isLoading.value = false
    }
  }
  onMounted(loadSeasonEventData)

  watch(() => eventId.value, loadSeasonEventData)

  return {
    eventDetails,
    eventDetailsError,
    isLoading,
    loadSeasonEventData,
  }
}
