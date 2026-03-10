<script setup lang="ts">
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
import { useTeams } from '@/composables'

const { teams, teamsError, isLoading } = useTeams()
</script>

<template>
  <TheBreadcrumbs />
  <hr />
  <h2>Teams</h2>
  <p v-if="isLoading" aria-busy="true">Loading teams...</p>
  <p v-else-if="teamsError">{{ teamsError }}</p>
  <ul v-else-if="teams.length">
    <li v-for="team in teams" :key="team.id">
      <img
        v-if="team.badge"
        :src="team.badge"
        :alt="`Team badge of ${team.name}`"
        class="badge"
        width="36"
      />
      <RouterLink :to="{ name: 'TeamDetails', params: { teamId: team.id } }">
        {{ team.name }} ({{ team.country }}) </RouterLink
      ><br />
    </li>
  </ul>
  <p v-else>No data available</p>
</template>
