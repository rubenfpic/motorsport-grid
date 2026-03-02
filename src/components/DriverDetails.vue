<script setup lang="ts">
import type { Driver } from '@/types'

defineProps<{
  driverDetails: Driver
}>()
</script>

<template>
  <ul>
    <li><strong>Nombre:</strong> {{ driverDetails.name }}</li>
    <li><strong>Equipo:</strong> {{ driverDetails.team }}</li>
    <li><strong>Nacionalidad:</strong> {{ driverDetails.nationality }}</li>
  </ul>
  <div class="grid">
    <p>{{ driverDetails.description }}</p>
    <img
      v-if="driverDetails.photo"
      :src="driverDetails.photo"
      :alt="`Imagen del póster de ${driverDetails.name}`"
      :title="`Póster de ${driverDetails.name}`"
    />
  </div>
</template>
