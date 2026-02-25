import SeasonService from '@/services/season.service'
import type { SeasonEventDetails } from '@/types/season-event.type'
import { onMounted, ref, watch, type ComputedRef } from 'vue'

export function useEventData(seasonYear: ComputedRef<string>, eventId: ComputedRef<string>) {
  const eventDetails = ref<SeasonEventDetails | null>(null)
  const eventDetailsError = ref<string | null>(null)
  const isLoading = ref(true)
  const seasonService = new SeasonService()

  const loadSeasonEventData = async () => {
    eventDetailsError.value = null
    isLoading.value = true

    try {
      eventDetails.value = await seasonService.getSeasonEvent(seasonYear.value, eventId.value)
    } catch (error) {
      console.error('Error al cargar los detalles del evento:', error)
      eventDetailsError.value = 'No se pudieron cargar los detalles del evento.'
    } finally {
      isLoading.value = false
    }
  }
  onMounted(loadSeasonEventData)

  watch([() => seasonYear.value, () => eventId.value], loadSeasonEventData)

  return {
    eventDetails,
    eventDetailsError,
    isLoading,
    loadSeasonEventData,
  }
}
