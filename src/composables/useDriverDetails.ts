import { DriverService } from '@/services/driver.service'
import type { Driver } from '@/types'
import { onMounted, ref } from 'vue'

export function useDriverDetails(driverId: number) {
  const driverDetails = ref<Driver | null>(null)
  const driverDetailsError = ref<string>('')
  const isLoading = ref(true)
  const driverService = new DriverService()

  const loadDriverDetails = async () => {
    driverDetailsError.value = ''
    isLoading.value = true

    try {
      driverDetails.value = await driverService.getDriverById(driverId)
    } catch (error) {
      console.error('Error loading data: ', error)
      driverDetailsError.value = 'Could not load driver details'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadDriverDetails)

  return {
    driverDetails,
    driverDetailsError,
    isLoading,
    loadDriverDetails,
  }
}
