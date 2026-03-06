<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import { useTeams } from '@/composables'

const { teams, teamsError, isLoading } = useTeams()
</script>

<template>
  <BreadcrumbsNav />
  <hr />
  <h2>Equipos</h2>
  <p v-if="isLoading" aria-busy="true">Cargando equipos...</p>
  <p v-else-if="teamsError">{{ teamsError }}</p>
  <ul v-else-if="teams.length">
    <li v-for="team in teams" :key="team.id">
      <img v-if="team.badge" :src="team.badge" alt="Badge" class="badge" width="36" />
      <RouterLink :to="{ name: 'TeamDetails', params: { teamId: team.id } }">
        {{ team.name }} ({{ team.country }}) </RouterLink
      ><br />
    </li>
  </ul>
  <p v-else>Sin datos disponibles</p>
</template>
