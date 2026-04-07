<script setup lang="ts">
import { useTeams } from '@/composables'

const { teams, teamsError, isLoading } = useTeams()
</script>

<template>
  <article>
    <header>
      <h3>Teams</h3>
    </header>
    <p v-if="isLoading" aria-busy="true">Loading teams...</p>
    <p v-else-if="teamsError">{{ teamsError }}</p>
    <ul v-else-if="teams.length">
      <li v-for="team in teams" :key="team.id">
        <RouterLink :to="{ name: 'TeamDetails', params: { teamId: team.id } }">
          {{ team.name }}
        </RouterLink>
      </li>
    </ul>
    <p v-else>No data available</p>
    <RouterLink :to="{ name: 'Teams' }">View detailed list</RouterLink>
  </article>
</template>
