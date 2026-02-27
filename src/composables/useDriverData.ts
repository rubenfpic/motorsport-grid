import { DriverService } from '@/services/driver.service'
import type { Driver } from '@/types/driver.type'
import { onMounted, ref } from 'vue'

export function useDriverData(teamId?: number) {
  const drivers = ref<Driver[]>([])
  const driversError = ref<string>('')
  const isDriversLoading = ref(true)
  const driverService = new DriverService()

  const loadDriversData = async (teamId: number) => {
    driversError.value = ''
    isDriversLoading.value = true

    try {
      drivers.value = await driverService.getDriversByTeam(teamId)
    } catch (error) {
      console.error('Error al obtener los pilotos del equipo:', error)
      driversError.value = 'No se pudieron cargar los pilotos del equipo.'
    } finally {
      isDriversLoading.value = false
    }
  }

  onMounted(() => {
    if (teamId !== undefined) void loadDriversData(teamId)
  })

  return {
    drivers,
    driversError,
    isDriversLoading,
    loadDriversData,
  }
}
