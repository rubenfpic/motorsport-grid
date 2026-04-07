<script setup lang="ts">
import DriverDetails from '@/components/drivers/DriverDetails.vue'
import { useDriverDetails } from '@/composables'
import { useRoute } from 'vue-router'

const route = useRoute()
const driverId = Number(route.params.driverId)
const { driverDetails, driverDetailsError, isLoading } = useDriverDetails(driverId)
</script>

<template>
  <p v-if="isLoading" aria-busy="true">Loading driver details...</p>
  <p v-else-if="driverDetailsError">{{ driverDetailsError }}</p>
  <DriverDetails v-else-if="driverDetails" :driver-details="driverDetails" />
  <p v-else>No data found</p>
</template>
