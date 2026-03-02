<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import { useTeamData } from '@/composables/useTeamData'
import { useRoute } from 'vue-router'
import { useDriverData } from '@/composables/useDriverData'

const route = useRoute()
const { team, teamError, isTeamLoading } = useTeamData(Number(route.params.teamId))
const { drivers, driversError, isDriversLoading } = useDriverData(Number(route.params.teamId))
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
  <hr />
  <h3>Pilotos</h3>
  <p v-if="isDriversLoading" aria-busy="true">Cargando pilotos...</p>
  <p v-else-if="driversError">{{ driversError }}</p>
  <ul v-else-if="drivers.length > 0">
    <li v-for="driver in drivers" :key="driver.id">
      <RouterLink :to="{ name: 'DriverDetails', params: { driverId: driver.id } }">
        {{ driver.name }} ({{ driver.nationality }})
      </RouterLink>
    </li>
  </ul>
  <p v-else>No hay pilotos disponibles para este equipo.</p>
</template>
