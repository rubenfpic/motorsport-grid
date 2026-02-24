<script setup lang="ts">
import { useRoute } from 'vue-router'
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import SeasonService from '@/services/season.service'
import { onMounted, ref } from 'vue'
import type { SeasonEventDetails } from '@/types/season-event.type'

const route = useRoute()
const eventDetails = ref<SeasonEventDetails | null>(null)
const eventDetailsError = ref<string | null>(null)
const seasonService = new SeasonService()
const isLoading = ref(true)

const loadSeasonEventData = async () => {
  eventDetailsError.value = null
  isLoading.value = true

  try {
    eventDetails.value = await seasonService.getSeasonEvent(
      String(route.params.season),
      String(route.params.event),
    )
  } catch (error) {
    console.error('Error al cargar los detalles del evento:', error)
    eventDetailsError.value = 'No se pudieron cargar los detalles del evento.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadSeasonEventData)
</script>

<template>
  <BreadcrumbsNav />
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
