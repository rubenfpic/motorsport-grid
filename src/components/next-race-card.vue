<script setup lang="ts">
import type { NextRace } from '@/types/next-race.type'

defineProps<{
  nextRace: NextRace | null
}>()
</script>

<template>
  <article v-if="nextRace">
    <header><strong>Próxima carrera</strong></header>
    <p>
      <strong>{{ nextRace.name }}</strong>
    </p>
    <ul>
      <li>Fecha: {{ nextRace.date }}</li>
      <li>Circuito: {{ nextRace.venue }}</li>
      <li>Ubicación: {{ nextRace.city }} ({{ nextRace.country }})</li>
    </ul>
  </article>
</template>
