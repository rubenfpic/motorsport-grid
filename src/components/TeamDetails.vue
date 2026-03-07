<script setup lang="ts">
import { useFavoriteStore } from '@/stores/useFavoriteStore'
import type { Team } from '@/types'
import { ref } from 'vue'

defineProps<{
  team: Team
}>()

const favorite = useFavoriteStore()
const isToastOpen = ref(false)
const toastMessage = ref('')

const onFavoriteToggle = (teamId: number) => {
  const isFavorite = favorite.isFavoriteTeam(teamId)

  if (isFavorite) {
    favorite.clearFavoriteTeam()
    toastMessage.value = 'Equipo eliminado de favoritos'
    isToastOpen.value = false
  } else {
    favorite.setFavoriteTeam(teamId)
    toastMessage.value = 'Equipo añadido a favoritos'
    isToastOpen.value = true
  }

  isToastOpen.value = true
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
  <info-toast :open="isToastOpen" :message="toastMessage" @close="isToastOpen = false" />
  <hr />
  <p>
    <strong>ID: </strong>
    <status-badge :label="team.id" />
  </p>
  <p><strong>País:</strong> {{ team.country }}</p>
  <p><strong>Fundado:</strong> {{ team.formed }}</p>
  <p><strong>Descripción:</strong> {{ team.description }}</p>
</template>
