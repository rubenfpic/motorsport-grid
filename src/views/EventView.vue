<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import EventDetails from '@/components/EventDetails.vue'
import { useEventData } from '@/composables/useEventData'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const seasonYear = computed(() => String(route.params.seasonYear ?? ''))
const eventId = computed(() => String(route.params.eventId ?? ''))
const { eventDetails, eventDetailsError, isLoading } = useEventData(seasonYear, eventId)
</script>

<template>
  <BreadcrumbsNav :event-name="eventDetails?.name" />
  <hr />
  <p v-if="isLoading" aria-busy="true">Cargando detalles del evento...</p>
  <p v-else-if="eventDetailsError">{{ eventDetailsError }}</p>
  <EventDetails v-else-if="eventDetails" :event-details="eventDetails" />
  <p v-else>Datos no encontrados</p>
</template>
