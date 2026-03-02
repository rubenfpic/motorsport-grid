import { DriverService } from '@/services/driver.service'
import type { Driver } from '@/types'
import { onMounted, ref } from 'vue'

export function useTeamDrivers(teamId: number) {
  const drivers = ref<Driver[]>([])
  const driversError = ref<string>('')
  const isDriversLoading = ref(true)
  const driverService = new DriverService()

  const loadTeamDrivers = async () => {
    driversError.value = ''
    isDriversLoading.value = true

    try {
      drivers.value = await driverService.getDriversByTeamId(teamId)
    } catch (error) {
      console.error('Error al obtener los pilotos del equipo:', error)
      driversError.value = 'No se pudieron cargar los pilotos del equipo.'
    } finally {
      isDriversLoading.value = false
    }
  }

  onMounted(() => {
    void loadTeamDrivers()
  })

  return {
    drivers,
    driversError,
    isDriversLoading,
    loadTeamDrivers,
  }
}
