<script setup lang="ts">
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
import DriverDetails from '@/components/DriverDetails.vue'
import { useDriverDetails } from '@/composables'
import { useRoute } from 'vue-router'

const route = useRoute()
const driverId = Number(route.params.driverId)
const { driverDetails, driverDetailsError, isLoading } = useDriverDetails(driverId)
</script>

<template>
  <TheBreadcrumbs
    :team-id="driverDetails?.teamId ?? undefined"
    :team-name="driverDetails?.team ?? ''"
    :driver-name="driverDetails?.name ?? String(route.params.driverId ?? '')"
  />
  <hr />
  <p v-if="isLoading" aria-busy="true">Loading driver details...</p>
  <p v-else-if="driverDetailsError">{{ driverDetailsError }}</p>
  <DriverDetails v-else-if="driverDetails" :driver-details="driverDetails" />
  <p v-else>No data found</p>
</template>
