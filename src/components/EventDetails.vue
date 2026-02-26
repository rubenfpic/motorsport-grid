<script setup lang="ts">
import type { EventDetails } from '@/types/event-details.type'

defineProps<{
  eventDetails: EventDetails
}>()
</script>

<template>
  <h2>{{ eventDetails.name }}</h2>
  <ul>
    <li><strong>ID del Evento:</strong> {{ eventDetails.id }}</li>
    <li><strong>Temporada:</strong> {{ eventDetails.season }}</li>
    <li><strong>Venue:</strong> {{ eventDetails.venue }}</li>
    <li><strong>Ciudad:</strong> {{ eventDetails.city }}</li>
    <li><strong>País:</strong> {{ eventDetails.country }}</li>
    <li v-if="eventDetails.date"><strong>Fecha:</strong> {{ eventDetails.date }}</li>
    <img
      v-if="eventDetails.poster"
      :src="eventDetails.poster"
      :alt="`Imagen del póster de ${eventDetails.name}`"
      :title="`Póster de ${eventDetails.name}`"
    />
  </ul>
</template>
