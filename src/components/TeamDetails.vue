<script setup lang="ts">
import { useFavoriteStore } from '@/stores/useFavoriteStore'
import type { Team } from '@/types'
import { ref } from 'vue'

defineProps<{
  team: Team
}>()

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
</script>

<template>
  <h2>
    <img v-if="team.badge" :src="team.badge" :alt="`Team logo of ${team.name}`" width="72" />
    {{ team.name }}
    <fav-star
      :active="favorite.isFavoriteTeam(team.id) ? '' : null"
      @toggle="onFavoriteToggle(team.id)"
    ></fav-star>
  </h2>
  <info-toast ref="toastRef" />
  <hr />
  <p>
    <strong>ID: </strong>
    <status-badge :label="team.id" />
  </p>
  <p><strong>Country:</strong> {{ team.country }}</p>
  <p><strong>Founded:</strong> {{ team.formed }}</p>
  <p><strong>Description:</strong> {{ team.description }}</p>
</template>
