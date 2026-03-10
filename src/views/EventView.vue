<script setup lang="ts">
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
import EventDetails from '@/components/EventDetails.vue'
import { useEventDetails } from '@/composables'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const eventId = computed(() => String(route.params.eventId ?? ''))
const { eventDetails, eventDetailsError, isLoading } = useEventDetails(eventId)
</script>

<template>
  <TheBreadcrumbs :event-name="eventDetails?.name" />
  <hr />
  <p v-if="isLoading" aria-busy="true">Loading event details...</p>
  <p v-else-if="eventDetailsError">{{ eventDetailsError }}</p>
  <EventDetails v-else-if="eventDetails" :event-details="eventDetails" />
  <p v-else>No data found</p>
</template>
