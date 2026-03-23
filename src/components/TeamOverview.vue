<script setup lang="ts">
import type { Team } from '@/types'

defineProps<{
  team: Team
}>()
</script>

<template>
  <h3 class="visually-hidden">Team overview</h3>
  <img
    v-if="team.logo"
    :src="team.logo"
    :alt="`Team logo of ${team.name}`"
    style="max-height: 10rem; margin-bottom: 2rem"
  />
  <p><strong>Country:</strong> {{ team.country }}</p>
  <!-- <p><strong>Location:</strong> {{ team.location }}</p> -->
  <p><strong>Founded:</strong> {{ team.formed }}</p>
  <p>
    <strong>ID: </strong>
    <status-badge :label="team.id" />
  </p>
</template>
