<script setup lang="ts">
import type { NextRace } from '@/types/next-race.type'

defineProps<{
  nextRace: NextRace | null
  nextRaceError: string | null
}>()
</script>

<template>
  <article>
    <header><strong>Próxima carrera</strong></header>
    <template v-if="nextRace">
      <p>
        <strong>{{ nextRace.name }}</strong>
      </p>
      <ul>
        <li>Fecha: {{ nextRace.date }}</li>
        <li>Circuito: {{ nextRace.venue }}</li>
        <li>Ubicación: {{ nextRace.city }} ({{ nextRace.country }})</li>
      </ul>
    </template>
    <template v-else-if="nextRaceError">
      <p>No se pudo cargar la próxima carrera.</p>
    </template>
    <template v-else>
      <p>Cargando...</p>
    </template>
  </article>
</template>
