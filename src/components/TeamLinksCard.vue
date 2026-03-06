<script setup lang="ts">
import { useTeams } from '@/composables'

const { teams, teamsError, isLoading } = useTeams()
</script>

<template>
  <article>
    <header>Equipos</header>
    <p v-if="isLoading" aria-busy="true">Cargando equipos...</p>
    <p v-else-if="teamsError">{{ teamsError }}</p>
    <ul v-else-if="teams.length">
      <li v-for="team in teams" :key="team.id">
        <RouterLink :to="{ name: 'TeamDetails', params: { teamId: team.id } }">
          {{ team.name }}
        </RouterLink>
      </li>
    </ul>
    <p v-else>Sin datos disponibles</p>
    <RouterLink :to="{ name: 'Teams' }">Ver listado detallado</RouterLink>
  </article>
</template>
