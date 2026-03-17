<script setup lang="ts">
import TeamDetails from '@/components/TeamDetails.vue'
import TeamDriversList from '@/components/TeamDriversList.vue'
import { useTeamDetails, useTeamDrivers } from '@/composables'
import { useRoute } from 'vue-router'

const route = useRoute()
const { team, teamError, isLoading: isTeamLoading } = useTeamDetails(Number(route.params.teamId))
const { drivers, driversError, isDriversLoading } = useTeamDrivers(Number(route.params.teamId))
const tabs = [
  { id: 'overview', label: 'Details' },
  { id: 'members', label: 'Drivers' },
]
</script>

<template>
  <content-tabs .tabList="tabs">
    <div slot="overview">
      <h3>Team details</h3>
      <p v-if="isTeamLoading" aria-busy="true">Loading team...</p>
      <p v-else-if="teamError">{{ teamError }}</p>
      <TeamDetails v-else-if="team" :team="team" />
      <p v-else>No data available.</p>
    </div>
    <div slot="members">
      <h3>Team drivers</h3>
      <p v-if="isDriversLoading" aria-busy="true">Loading drivers...</p>
      <p v-else-if="driversError">{{ driversError }}</p>
      <TeamDriversList v-else-if="drivers.length > 0" :drivers="drivers" />
      <p v-else>No drivers available.</p>
    </div>
  </content-tabs>
</template>
