import { DashboardService } from '@/services/dashboard.service'
import type { NextEvent } from '@/types/next-event.type'
import type { PastEvent } from '@/types/past-event.type'
import { onMounted, ref } from 'vue'

export function useDashboard() {
  const nextEvent = ref<NextEvent | null>(null)
  const pastEvent = ref<PastEvent | null>(null)
  const nextEventError = ref<string | null>(null)
  const pastEventError = ref<string | null>(null)
  const isNextEventLoading = ref(true)
  const isPastEventLoading = ref(true)
  const dtmService = new DashboardService()

  const loadDashboard = async () => {
    nextEventError.value = null
    pastEventError.value = null
    isNextEventLoading.value = true
    isPastEventLoading.value = true

    try {
      nextEvent.value = await dtmService.getNextEvent()
    } catch (error) {
      console.error('Error al obtener la próxima carrera:', error)
      nextEventError.value = 'No se pudo cargar la próxima carrera.'
    } finally {
      isNextEventLoading.value = false
    }

    try {
      pastEvent.value = await dtmService.getPastEvent()
    } catch (error) {
      console.error('Error al obtener la última carrera:', error)
      pastEventError.value = 'No se pudo cargar la última carrera.'
    } finally {
      isPastEventLoading.value = false
    }
  }

  onMounted(loadDashboard)

  return {
    nextEvent,
    pastEvent,
    nextEventError,
    pastEventError,
    isNextEventLoading,
    isPastEventLoading,
    loadDashboard,
  }
}
