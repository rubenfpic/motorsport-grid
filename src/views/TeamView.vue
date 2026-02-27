<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import { useTeamData } from '@/composables/useTeamData'
import { useRoute } from 'vue-router'

const route = useRoute()
const { team, teamError, isTeamLoading } = useTeamData(Number(route.params.teamId))
</script>

<template>
  <BreadcrumbsNav :team-name="team?.name" />
  <hr />
  <p v-if="isTeamLoading" aria-busy="true">Cargando equipo...</p>
  <p v-else-if="teamError">{{ teamError }}</p>
  <template v-else-if="team">
    <h2>{{ team.name }}</h2>
    <p><strong>ID:</strong> {{ team.id }}</p>
    <p><strong>País:</strong> {{ team.country }}</p>
    <p><strong>Fundado:</strong> {{ team.formed }}</p>
    <p><strong>Descripción:</strong> {{ team.description }}</p>
  </template>
  <p v-else>Sin datos disponibles</p>
</template>
