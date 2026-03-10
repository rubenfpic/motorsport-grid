<script setup lang="ts">
import type { NextEvent } from '@/types'

defineProps<{
  nextEvent: NextEvent | null
  nextEventError: string | null
  isNextEventLoading: boolean
}>()
</script>

<template>
  <article>
    <header>
      <h3>Next race</h3>
    </header>
    <p v-if="isNextEventLoading" aria-busy="true">Loading...</p>
    <p v-else-if="nextEventError">Could not load the next race.</p>
    <template v-else-if="nextEvent">
      <p>{{ nextEvent.name }}</p>
      <ul>
        <li>Date: {{ nextEvent.date }}</li>
        <li>Circuit: {{ nextEvent.venue }}</li>
        <li>Location: {{ nextEvent.city }} ({{ nextEvent.country }})</li>
      </ul>
      <RouterLink
        :to="{
          name: 'Event',
          params: { seasonYear: String(nextEvent.season), eventId: nextEvent.id },
        }"
        >View event details</RouterLink
      >
    </template>
    <p v-else>No data found</p>
  </article>
</template>
