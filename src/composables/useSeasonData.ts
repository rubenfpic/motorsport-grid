import SeasonService from '@/services/season.service'
import type { SeasonEvent } from '@/types/season-event.type'
import { onMounted, ref, watch, type ComputedRef } from 'vue'

export function useSeasonData(seasonYear: ComputedRef<string>) {
  const seasonEvents = ref<SeasonEvent[]>([])
  const seasonEventsError = ref<string>('')
  const seasonService = new SeasonService()
  const isLoading = ref(true)

  const loadSeasonEventsData = async () => {
    seasonEventsError.value = ''
    isLoading.value = true

    try {
      seasonEvents.value = await seasonService.getSeasonEvents(seasonYear.value)
    } catch (error) {
      console.error('Error al obtener los eventos de la temporada:', error)
      seasonEventsError.value = 'No se pudieron cargar los eventos de la temporada.'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadSeasonEventsData)

  // Si cambia la temporada, volvemos a pedir los eventos sin recargar la página.
  watch(() => seasonYear.value, loadSeasonEventsData)

  return {
    seasonEvents,
    seasonEventsError,
    isLoading,
    loadSeasonEventsData,
  }
}
