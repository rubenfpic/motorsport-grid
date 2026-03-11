<script setup lang="ts">
import type { PastEvent } from '@/types'

defineProps<{
  pastEvent: PastEvent | null
  pastEventError: string | null
  isPastEventLoading: boolean
}>()
</script>

<template>
  <article>
    <header>
      <h3>Last race</h3>
    </header>
    <p v-if="isPastEventLoading" aria-busy="true">Loading...</p>
    <p v-else-if="pastEventError">Could not load the last race.</p>
    <template v-else-if="pastEvent">
      <div class="grid">
        <div>
          <h4>{{ pastEvent.name }}</h4>
          <ul>
            <li>Date: {{ pastEvent.date }}</li>
            <li>Circuit: {{ pastEvent.venue }}</li>
            <li>Location: {{ pastEvent.city }} ({{ pastEvent.country }})</li>
          </ul>
        </div>
        <div>
          <template v-if="pastEvent.podium.length">
            <h4>Podium</h4>
            <ul>
              <li v-for="(participant, index) in pastEvent.podium" :key="index">
                {{ participant.position }}. {{ participant.driver }} ({{ participant.team }})
              </li>
            </ul>
          </template>
        </div>
      </div>
      <RouterLink
        :to="{
          name: 'Event',
          params: { seasonYear: String(pastEvent.season), eventId: pastEvent.id },
        }"
        >View event details</RouterLink
      >
    </template>
    <p v-else>No data found</p>
  </article>
</template>
