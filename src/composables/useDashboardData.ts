import { DtmService } from '@/services/dtm.service'
import type { NextRace } from '@/types/next-race.type'
import type { PastRace } from '@/types/past-race.type'
import { onMounted, ref } from 'vue'

export function useDashboardData() {
  const nextRace = ref<NextRace | null>(null)
  const pastRace = ref<PastRace | null>(null)
  const nextRaceError = ref<string | null>(null)
  const pastRaceError = ref<string | null>(null)
  const dtmService = new DtmService()

  const loadDashboardData = async () => {
    nextRaceError.value = null
    pastRaceError.value = null

    try {
      nextRace.value = await dtmService.getNextRace()
    } catch (error) {
      console.error('Error al obtener la próxima carrera:', error)
      nextRaceError.value = 'No se pudo cargar la próxima carrera.'
    }

    try {
      pastRace.value = await dtmService.getPastRace()
    } catch (error) {
      console.error('Error al obtener la última carrera:', error)
      pastRaceError.value = 'No se pudo cargar la última carrera.'
    }
  }

  onMounted(loadDashboardData)

  return {
    nextRace,
    pastRace,
    nextRaceError,
    pastRaceError,
    loadDashboardData,
  }
}
