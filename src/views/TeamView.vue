<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import TeamDetails from '@/components/TeamDetails.vue'
import TeamDriversList from '@/components/TeamDriversList.vue'
import { useTeamDetails, useTeamDrivers } from '@/composables'
import { useRoute } from 'vue-router'

const route = useRoute()
const { team, teamError, isLoading: isTeamLoading } = useTeamDetails(Number(route.params.teamId))
const { drivers, driversError, isDriversLoading } = useTeamDrivers(Number(route.params.teamId))
</script>

<template>
  <BreadcrumbsNav :team-name="team?.name" />
  <hr />
  <p v-if="isTeamLoading" aria-busy="true">Loading team...</p>
  <p v-else-if="teamError">{{ teamError }}</p>
  <TeamDetails v-else-if="team" :team="team" />
  <p v-else>No data available</p>
  <hr />
  <h3>Drivers</h3>
  <p v-if="isDriversLoading" aria-busy="true">Loading drivers...</p>
  <p v-else-if="driversError">{{ driversError }}</p>
  <TeamDriversList v-else-if="drivers.length > 0" :drivers="drivers" />
  <p v-else>No drivers available for this team.</p>
</template>
