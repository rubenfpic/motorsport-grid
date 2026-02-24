import SeasonService from '@/services/season.service'
import type { SeasonEvent } from '@/types/season-event.type'
import { onMounted, ref, watch, type ComputedRef } from 'vue'

export function useSeasonData(season: ComputedRef<string>) {
  const seasonEvents = ref<SeasonEvent[]>([])
  const seasonEventsError = ref<string>('')
  const seasonService = new SeasonService()

  const loadSeasonEventsData = async () => {
    seasonEventsError.value = ''

    try {
      seasonEvents.value = await seasonService.getSeasonEvents(season.value)
    } catch (error) {
      console.error('Error al obtener los eventos de la temporada:', error)
      seasonEventsError.value = 'No se pudieron cargar los eventos de la temporada.'
    }
  }

  onMounted(loadSeasonEventsData)

  // Si cambia la temporada, volvemos a pedir los eventos sin recargar la página.
  watch(() => season.value, loadSeasonEventsData)

  return {
    seasonEvents,
    seasonEventsError,
    loadSeasonEventsData,
  }
}
