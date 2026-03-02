<script setup lang="ts">
import type { SeasonEvent } from '@/types'

defineProps<{
  seasonYear: string
  seasonEvents: SeasonEvent[]
}>()
</script>

<template>
  <dl>
    <template v-for="event in seasonEvents" :key="event.id">
      <dt>
        <RouterLink
          :to="{
            name: 'Event',
            params: { seasonYear: seasonYear, eventId: event.id },
          }"
          >{{ event.name }}</RouterLink
        >
      </dt>
      <dd>{{ event.date }}</dd>
      <dd>{{ event.city }} ({{ event.country }})</dd>
    </template>
  </dl>
</template>
