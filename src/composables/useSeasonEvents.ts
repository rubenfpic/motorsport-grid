import SeasonService from '@/services/season.service'
import { useCompetitionStore } from '@/stores/useCompetitionStore'
import type { SeasonEvent } from '@/types'
import { onMounted, ref, watch, type ComputedRef } from 'vue'

export function useSeasonEvents(seasonYear: ComputedRef<string>) {
  const seasonEvents = ref<SeasonEvent[]>([])
  const seasonEventsError = ref<string>('')
  const seasonService = new SeasonService()
  const isLoading = ref(true)
  const competitionStore = useCompetitionStore()

  const loadSeasonEvents = async () => {
    seasonEventsError.value = ''
    isLoading.value = true

    try {
      seasonEvents.value = await seasonService.getSeasonEventsByYear(seasonYear.value)
    } catch (error) {
      console.error('Error al obtener los eventos de la temporada:', error)
      seasonEventsError.value = 'No se pudieron cargar los eventos de la temporada.'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadSeasonEvents)

  // Si cambia la temporada, volvemos a pedir los eventos sin recargar la página.
  watch([() => seasonYear.value, () => competitionStore.competitionId], loadSeasonEvents)

  return {
    seasonEvents,
    seasonEventsError,
    isLoading,
    loadSeasonEvents,
  }
}
