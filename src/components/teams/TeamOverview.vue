<script setup lang="ts">
import type { Team } from '@/types'

defineProps<{
  team: Team
}>()
</script>

<template>
  <img
    v-if="team.logo"
    :src="team.logo"
    :alt="`Team logo of ${team.name}`"
    style="max-height: 10rem; margin-bottom: 2rem"
  />
  <ul>
    <li><strong>Country:</strong> {{ team.country }}</li>
    <!-- <p><strong>Location:</strong> {{ team.location }}</p> -->
    <li><strong>Founded:</strong> {{ team.formed }}</li>
    <li><status-badge :label="`id: ${team.id}`" /></li>
  </ul>
</template>
