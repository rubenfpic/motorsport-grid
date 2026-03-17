<script setup lang="ts">
import TeamDescription from '@/components/TeamDescription.vue'
import TeamDrivers from '@/components/TeamDrivers.vue'
import TeamOverview from '@/components/TeamOverview.vue'
import { useTeamDetails, useTeamDrivers } from '@/composables'
import { useFavoriteStore } from '@/stores/useFavoriteStore'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { team, teamError, isLoading: isTeamLoading } = useTeamDetails(Number(route.params.teamId))
const { drivers, driversError, isDriversLoading } = useTeamDrivers(Number(route.params.teamId))
const favorite = useFavoriteStore()
const toastRef = ref()
const onFavoriteToggle = (teamId: number) => {
  const isFavorite = favorite.isFavoriteTeam(teamId)

  if (isFavorite) {
    favorite.clearFavoriteTeam()
    toastRef.value.show('Team removed from favorites')
  } else {
    favorite.setFavoriteTeam(teamId)
    toastRef.value.show('Team added to favorites')
  }
}
const tabs = [
  { id: 'overview', label: 'Details' },
  { id: 'description', label: 'Description' },
  { id: 'members', label: 'Drivers' },
]
</script>

<template>
  <info-toast ref="toastRef" .delay="5000" variant="info" />
  <h2 v-if="team">
    <img v-if="team.badge" :src="team.badge" :alt="`Team logo of ${team.name}`" width="72" />
    {{ team.name }}
    <fav-star
      :active="favorite.isFavoriteTeam(team.id) ? '' : null"
      :item-name="team.name"
      @toggle="onFavoriteToggle(team.id)"
    ></fav-star>
  </h2>

  <content-tabs .tabList="tabs">
    <div slot="overview">
      <h3>Team details</h3>
      <p v-if="isTeamLoading" aria-busy="true">Loading team...</p>
      <p v-else-if="teamError">{{ teamError }}</p>
      <TeamOverview v-else-if="team" :team="team" />
      <p v-else>No data available.</p>
    </div>
    <div slot="description">
      <h3>Team description</h3>
      <p v-if="isTeamLoading" aria-busy="true">Loading description...</p>
      <p v-else-if="teamError">{{ teamError }}</p>
      <TeamDescription v-else-if="team?.description" :team="team" />
      <p v-else>No description available.</p>
    </div>
    <div slot="members">
      <h3>Team drivers</h3>
      <p v-if="isDriversLoading" aria-busy="true">Loading drivers...</p>
      <p v-else-if="driversError">{{ driversError }}</p>
      <TeamDrivers v-else-if="drivers.length > 0" :drivers="drivers" />
      <p v-else>No drivers available.</p>
    </div>
  </content-tabs>
</template>
