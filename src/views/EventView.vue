<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import { useEventData } from '@/composables/useEventData'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const seasonYear = computed(() => String(route.params.season ?? ''))
const eventId = computed(() => String(route.params.event ?? ''))
const { eventDetails, eventDetailsError, isLoading } = useEventData(seasonYear, eventId)
</script>

<template>
  <BreadcrumbsNav :event-name="eventDetails?.name" />
  <hr />
  <p v-if="isLoading" aria-busy="true">Cargando detalles del evento...</p>
  <p v-else-if="eventDetailsError">{{ eventDetailsError }}</p>
  <template v-else-if="eventDetails">
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
  <p v-else>Datos no encontrados</p>
</template>
