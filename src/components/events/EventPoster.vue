<script setup lang="ts">
import type { EventDetails } from '@/types'

defineProps<{
  eventDetails: EventDetails
}>()
</script>

<template>
  <img
    v-if="eventDetails.poster"
    :src="eventDetails.poster"
    :alt="`Official poster for ${eventDetails.name}`"
  />
</template>
