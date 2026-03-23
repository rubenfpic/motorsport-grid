<script setup lang="ts">
import type { Team } from '@/types'

defineProps<{
  team: Team
}>()
</script>

<template>
  <h3>Team description</h3>
  <p>{{ team.description }}</p>
</template>
