<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import { useTeamData } from '@/composables/useTeamData'

const { teams, teamsError, isLoading } = useTeamData()
</script>

<template>
  <BreadcrumbsNav />
  <hr />
  <h2>Equipos</h2>
  <p v-if="isLoading" aria-busy="true">Cargando equipos...</p>
  <p v-else-if="teamsError">{{ teamsError }}</p>
  <ul v-else-if="teams.length">
    <li v-for="team in teams" :key="team.id">
      <RouterLink :to="{ name: 'TeamDetails', params: { teamId: team.id } }">
        {{ team.name }}
      </RouterLink>
      ({{ team.id }})
    </li>
  </ul>
  <p v-else>Sin datos disponibles</p>
</template>
