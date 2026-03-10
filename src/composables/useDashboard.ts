import { DashboardService } from '@/services/dashboard.service'
import type { CurrentStandings, NextEvent, PastEvent } from '@/types'
import { onMounted, ref } from 'vue'

export function useDashboard() {
  const nextEvent = ref<NextEvent | null>(null)
  const pastEvent = ref<PastEvent | null>(null)
  const currentStandings = ref<CurrentStandings | null>(null)
  const nextEventError = ref<string | null>(null)
  const pastEventError = ref<string | null>(null)
  const currentStandingsError = ref<string | null>(null)
  const isNextEventLoading = ref(true)
  const isPastEventLoading = ref(true)
  const isCurrentStandingsLoading = ref(true)
  const dashboardService = new DashboardService()

  const loadDashboard = async () => {
    nextEventError.value = null
    pastEventError.value = null
    currentStandingsError.value = null
    isNextEventLoading.value = true
    isPastEventLoading.value = true
    isCurrentStandingsLoading.value = true

    try {
      nextEvent.value = await dashboardService.getNextEvent()
    } catch (error) {
      console.error('Error fetching next race:', error)
      nextEventError.value = 'Could not load the next race.'
    } finally {
      isNextEventLoading.value = false
    }

    try {
      pastEvent.value = await dashboardService.getPastEvent()
    } catch (error) {
      console.error('Error fetching last race:', error)
      pastEventError.value = 'Could not load the last race.'
    } finally {
      isPastEventLoading.value = false
    }

    try {
      currentStandings.value = await dashboardService.getCurrentStandings()
    } catch (error) {
      console.error('Error fetching current standings:', error)
      currentStandingsError.value = 'Could not load current standings.'
    } finally {
      isCurrentStandingsLoading.value = false
    }
  }

  onMounted(loadDashboard)

  return {
    nextEvent,
    pastEvent,
    currentStandings,
    nextEventError,
    pastEventError,
    currentStandingsError,
    isNextEventLoading,
    isPastEventLoading,
    isCurrentStandingsLoading,
    loadDashboard,
  }
}
