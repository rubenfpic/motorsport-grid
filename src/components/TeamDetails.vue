<script setup lang="ts">
import type { Team } from '@/types'

defineProps<{
  team: Team
}>()
</script>

<template>
  <h2>{{ team.name }}</h2>
  <p><strong>ID:</strong> {{ team.id }}</p>
  <p><strong>País:</strong> {{ team.country }}</p>
  <p><strong>Fundado:</strong> {{ team.formed }}</p>
  <p><strong>Descripción:</strong> {{ team.description }}</p>
</template>
