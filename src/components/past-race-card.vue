<script setup lang="ts">
import type { PastRace } from '@/types/past-race.type'

defineProps<{
  pastRace: PastRace | null
}>()
</script>

<template>
  <article v-if="pastRace">
    <header><strong>Última carrera</strong></header>
    <p>
      <strong>{{ pastRace.name }}</strong>
    </p>
    <ul>
      <li>Fecha: {{ pastRace.date }}</li>
      <li>Circuito: {{ pastRace.venue }}</li>
      <li>Ubicación: {{ pastRace.city }} ({{ pastRace.country }})</li>
    </ul>
  </article>
</template>
