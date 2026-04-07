<script setup lang="ts">
import type { EventDetails } from '@/types'

defineProps<{
  eventDetails: EventDetails
}>()
</script>

<template>
  <ul>
    <li><strong>Season:</strong> {{ eventDetails.season }}</li>
    <li><strong>Venue:</strong> {{ eventDetails.venue }}</li>
    <li><strong>City:</strong> {{ eventDetails.city }}</li>
    <li><strong>Country:</strong> {{ eventDetails.country }}</li>
    <li v-if="eventDetails.date"><strong>Date:</strong> {{ eventDetails.date }}</li>
    <li><status-badge :label="`id: ${eventDetails.id}`" /></li>
  </ul>
</template>
