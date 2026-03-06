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
    <img v-if="team.badge" :src="team.badge" alt="Logo" width="72" />
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
  <hr />
  <p>
    <strong>ID: </strong>
    <status-badge :label="team.id" />
  </p>
  <p><strong>País:</strong> {{ team.country }}</p>
  <p><strong>Fundado:</strong> {{ team.formed }}</p>
  <p><strong>Descripción:</strong> {{ team.description }}</p>
</template>
