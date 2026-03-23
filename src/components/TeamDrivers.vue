<script setup lang="ts">
import type { Driver } from '@/types'

defineProps<{
  drivers: Driver[]
}>()
</script>

<template>
  <h3>Current drivers</h3>
  <ul>
    <li v-for="driver in drivers" :key="driver.id">
      <RouterLink :to="{ name: 'DriverDetails', params: { driverId: driver.id } }">
        {{ driver.name }} ({{ driver.nationality }})
      </RouterLink>
    </li>
  </ul>
</template>
