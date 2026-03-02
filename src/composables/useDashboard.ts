import { DashboardService } from '@/services/dashboard.service'
import type { NextRace } from '@/types/next-race.type'
import type { PastRace } from '@/types/past-race.type'
import { onMounted, ref } from 'vue'

export function useDashboard() {
  const nextRace = ref<NextRace | null>(null)
  const pastRace = ref<PastRace | null>(null)
  const nextRaceError = ref<string | null>(null)
  const pastRaceError = ref<string | null>(null)
  const isNextRaceLoading = ref(true)
  const isPastRaceLoading = ref(true)
  const dtmService = new DashboardService()

  const loadDashboard = async () => {
    nextRaceError.value = null
    pastRaceError.value = null
    isNextRaceLoading.value = true
    isPastRaceLoading.value = true

    try {
      nextRace.value = await dtmService.getNextRace()
    } catch (error) {
      console.error('Error al obtener la próxima carrera:', error)
      nextRaceError.value = 'No se pudo cargar la próxima carrera.'
    } finally {
      isNextRaceLoading.value = false
    }

    try {
      pastRace.value = await dtmService.getPastRace()
    } catch (error) {
      console.error('Error al obtener la última carrera:', error)
      pastRaceError.value = 'No se pudo cargar la última carrera.'
    } finally {
      isPastRaceLoading.value = false
    }
  }

  onMounted(loadDashboard)

  return {
    nextRace,
    pastRace,
    nextRaceError,
    pastRaceError,
    isNextRaceLoading,
    isPastRaceLoading,
    loadDashboard,
  }
}
