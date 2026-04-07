<script setup lang="ts">
import type { EventDetails } from '@/types'

defineProps<{
  eventDetails: EventDetails
}>()
</script>

<template>
  <ul>
    <li><strong>Event ID:</strong> {{ eventDetails.id }}</li>
    <li><strong>Season:</strong> {{ eventDetails.season }}</li>
    <li><strong>Venue:</strong> {{ eventDetails.venue }}</li>
    <li><strong>City:</strong> {{ eventDetails.city }}</li>
    <li><strong>Country:</strong> {{ eventDetails.country }}</li>
    <li v-if="eventDetails.date"><strong>Date:</strong> {{ eventDetails.date }}</li>
  </ul>
</template>
