<script setup lang="ts">
import type { Driver } from '@/types'

defineProps<{
  driverDetails: Driver
}>()
</script>

<template>
  <ul>
    <li><strong>ID:</strong> <status-badge :label="driverDetails.id" /></li>
    <li><strong>Name:</strong> {{ driverDetails.name }}</li>
    <li><strong>Team:</strong> {{ driverDetails.team }}</li>
    <li><strong>Nationality:</strong> {{ driverDetails.nationality }}</li>
  </ul>
  <div class="grid">
    <p>{{ driverDetails.description }}</p>
    <img
      v-if="driverDetails.photo"
      :src="driverDetails.photo"
      :alt="`Poster image of ${driverDetails.name}`"
      :title="`Poster of ${driverDetails.name}`"
    />
  </div>
</template>
