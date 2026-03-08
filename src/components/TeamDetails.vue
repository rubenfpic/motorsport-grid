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
    toastRef.value.show('Equipo eliminado de favoritos')
  } else {
    favorite.setFavoriteTeam(teamId)
    toastRef.value.show('Equipo añadido a favoritos')
  }
}
</script>

<template>
  <h2>
    <img v-if="team.badge" :src="team.badge" alt="Logo" width="72" />
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
  <p><strong>País:</strong> {{ team.country }}</p>
  <p><strong>Fundado:</strong> {{ team.formed }}</p>
  <p><strong>Descripción:</strong> {{ team.description }}</p>
</template>
