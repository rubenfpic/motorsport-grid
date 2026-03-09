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
          <p>{{ pastEvent.name }}</p>
          <ul>
            <li>Date: {{ pastEvent.date }}</li>
            <li>Circuit: {{ pastEvent.venue }}</li>
            <li>Location: {{ pastEvent.city }} ({{ pastEvent.country }})</li>
          </ul>
        </div>
        <div>
          <p>Podium:</p>
          <ul>
            <li v-for="(participant, index) in pastEvent.podium" :key="index">
              {{ participant.position }}. {{ participant.driver }} ({{ participant.team }})
            </li>
          </ul>
        </div>
      </div>
    </template>
    <p v-else>No data found</p>
  </article>
</template>
