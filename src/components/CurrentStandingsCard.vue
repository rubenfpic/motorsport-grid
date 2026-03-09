<script setup lang="ts">
import type { CurrentStandings } from '@/types'

defineProps<{
  currentStandings: CurrentStandings | null
  currentStandingsError: string | null
  isCurrentStandingsLoading: boolean
}>()
</script>

<template>
  <article>
    <header>
      <h3>Current standings</h3>
    </header>
    <p v-if="isCurrentStandingsLoading" aria-busy="true">Loading...</p>
    <p v-else-if="currentStandingsError">Could not load the current standings.</p>
    <template v-else-if="currentStandings">
      <table>
        <thead>
          <tr>
            <th scope="col">Pos</th>
            <th scope="col">Driver</th>
            <th scope="col">Team</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in currentStandings.entries"
            :key="`${entry.position}-${entry.driver}-${entry.team}`"
          >
            <td>{{ entry.position }}</td>
            <td>{{ entry.driver }}</td>
            <td>{{ entry.team }}</td>
            <td>{{ entry.points }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <p v-else>Standings not available.</p>
  </article>
</template>
