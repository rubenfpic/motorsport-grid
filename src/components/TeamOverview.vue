<script setup lang="ts">
import type { Team } from '@/types'

defineProps<{
  team: Team
}>()
</script>

<template>
  <p>
    <strong>ID: </strong>
    <status-badge :label="team.id" />
  </p>
  <p><strong>Country:</strong> {{ team.country }}</p>
  <p><strong>Founded:</strong> {{ team.formed }}</p>
</template>
