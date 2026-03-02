<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import TeamDetails from '@/components/TeamDetails.vue'
import TeamDriversList from '@/components/TeamDriversList.vue'
import { useTeamDetails } from '@/composables/useTeamDetails'
import { useRoute } from 'vue-router'
import { useTeamDrivers } from '@/composables/useTeamDrivers'

const route = useRoute()
const { team, teamError, isLoading: isTeamLoading } = useTeamDetails(Number(route.params.teamId))
const { drivers, driversError, isDriversLoading } = useTeamDrivers(Number(route.params.teamId))
</script>

<template>
  <BreadcrumbsNav :team-name="team?.name" />
  <hr />
  <p v-if="isTeamLoading" aria-busy="true">Cargando equipo...</p>
  <p v-else-if="teamError">{{ teamError }}</p>
  <TeamDetails v-else-if="team" :team="team" />
  <p v-else>Sin datos disponibles</p>
  <hr />
  <h3>Pilotos</h3>
  <p v-if="isDriversLoading" aria-busy="true">Cargando pilotos...</p>
  <p v-else-if="driversError">{{ driversError }}</p>
  <TeamDriversList v-else-if="drivers.length > 0" :drivers="drivers" />
  <p v-else>No hay pilotos disponibles para este equipo.</p>
</template>
