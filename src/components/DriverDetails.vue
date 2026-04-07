<script setup lang="ts">
import type { Driver } from '@/types'

defineProps<{
  driverDetails: Driver
}>()
</script>

<template>
  <ul>
    <li><strong>Name:</strong> {{ driverDetails.name }}</li>
    <li><strong>Team:</strong> {{ driverDetails.team }}</li>
    <li><strong>Nationality:</strong> {{ driverDetails.nationality }}</li>
    <li><status-badge :label="`id: ${driverDetails.id}`" /></li>
  </ul>
  <div class="grid">
    <p>{{ driverDetails.description }}</p>
    <img
      v-if="driverDetails.photo"
      :src="driverDetails.photo"
      :alt="`Portrait of ${driverDetails.name}`"
    />
  </div>
</template>
