<script setup lang="ts">
import { useFavoriteStore } from '@/stores/useFavoriteStore'
import type { Team } from '@/types'

const favorite = useFavoriteStore()

defineProps<{
  team: Team
}>()
</script>

<template>
  <h2>
    {{ team.name }}
    <fav-star
      :active="favorite.isFavoriteTeam(team.id) ? '' : null"
      @toggle="
        favorite.isFavoriteTeam(team.id)
          ? favorite.clearFavoriteTeam()
          : favorite.setFavoriteTeam(team.id)
      "
    ></fav-star>
  </h2>
  <p><strong>ID:</strong> {{ team.id }}</p>
  <p><strong>País:</strong> {{ team.country }}</p>
  <p><strong>Fundado:</strong> {{ team.formed }}</p>
  <p><strong>Descripción:</strong> {{ team.description }}</p>
</template>
