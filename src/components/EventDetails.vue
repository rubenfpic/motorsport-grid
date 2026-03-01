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
  </ul>
  <table v-if="eventDetails.result.length">
    <thead>
      <tr>
        <th scope="col">Posición</th>
        <th scope="col">Piloto</th>
        <th scope="col">Equipo</th>
        <th scope="col">Tiempo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="participant in eventDetails.result" :key="participant.position">
        <th scope="row">{{ participant.position }}</th>
        <td>{{ participant.driver }}</td>
        <td>{{ participant.team }}</td>
        <td>{{ participant.time }}</td>
      </tr>
    </tbody>
  </table>
  <img
    v-if="eventDetails.poster"
    :src="eventDetails.poster"
    :alt="`Imagen del póster de ${eventDetails.name}`"
    :title="`Póster de ${eventDetails.name}`"
  />
</template>
