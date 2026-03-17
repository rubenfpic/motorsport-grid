<script setup lang="ts">
import type { Team } from '@/types'

defineProps<{
  team: Team
}>()
</script>

<template>
  <p><strong>Description:</strong> {{ team.description }}</p>
</template>
