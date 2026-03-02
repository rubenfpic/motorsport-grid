<script setup lang="ts">
import type { Driver } from '@/types/driver.type'

defineProps<{
  drivers: Driver[]
}>()
</script>

<template>
  <ul>
    <li v-for="driver in drivers" :key="driver.id">
      <RouterLink :to="{ name: 'DriverDetails', params: { driverId: driver.id } }">
        {{ driver.name }} ({{ driver.nationality }})
      </RouterLink>
    </li>
  </ul>
</template>
