<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import EventDetails from '@/components/EventDetails.vue'
import { useEventDetails } from '@/composables/useEventDetails'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const eventId = computed(() => String(route.params.eventId ?? ''))
const { eventDetails, eventDetailsError, isLoading } = useEventDetails(eventId)
</script>

<template>
  <BreadcrumbsNav :event-name="eventDetails?.name" />
  <hr />
  <p v-if="isLoading" aria-busy="true">Cargando detalles del evento...</p>
  <p v-else-if="eventDetailsError">{{ eventDetailsError }}</p>
  <EventDetails v-else-if="eventDetails" :event-details="eventDetails" />
  <p v-else>Datos no encontrados</p>
</template>
