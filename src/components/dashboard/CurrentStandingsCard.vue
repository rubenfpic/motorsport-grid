<script setup lang="ts">
import type { CurrentStandings } from '@/types'
import { computed, ref } from 'vue'

const props = defineProps<{
  currentStandings: CurrentStandings | null
  currentStandingsError: string | null
  isCurrentStandingsLoading: boolean
}>()

const showAll = ref(false)
const MIN_VISIBLE = 5
const showToggle = computed(() => (props.currentStandings?.entries.length ?? 0) > MIN_VISIBLE)
const actualEntries = computed(() => {
  if (!props.currentStandings) return []
  if (!showAll.value) return props.currentStandings.entries.slice(0, MIN_VISIBLE)
  return props.currentStandings.entries
})
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
            v-for="entry in actualEntries"
            :key="`${entry.position}-${entry.driver}-${entry.team}`"
          >
            <td>{{ entry.position }}</td>
            <td>{{ entry.driver }}</td>
            <td>{{ entry.team }}</td>
            <td>{{ entry.points }}</td>
          </tr>
        </tbody>
      </table>
      <button v-if="showToggle" @click="showAll = !showAll">
        {{ showAll ? `See top ${MIN_VISIBLE}` : 'See all' }}
      </button>
    </template>
    <p v-else>Standings not available.</p>
  </article>
</template>
