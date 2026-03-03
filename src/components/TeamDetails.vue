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
    <button v-if="favorite.isFavoriteTeam(team.id)" @click="favorite.clearFavoriteTeam()">☆</button>
    <button v-else @click="favorite.setFavoriteTeam(team.id)">★</button>
  </h2>
  <p><strong>ID:</strong> {{ team.id }}</p>
  <p><strong>País:</strong> {{ team.country }}</p>
  <p><strong>Fundado:</strong> {{ team.formed }}</p>
  <p><strong>Descripción:</strong> {{ team.description }}</p>
</template>
