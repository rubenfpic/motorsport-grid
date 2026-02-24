<script setup lang="ts">
import type { NextRace } from '@/types/next-race.type'

defineProps<{
  nextRace: NextRace | null
  nextRaceError: string | null
  isNextRaceLoading: boolean
}>()
</script>

<template>
  <article>
    <header>Próxima carrera</header>
    <p v-if="isNextRaceLoading" aria-busy="true">Cargando...</p>
    <p v-else-if="nextRaceError">No se pudo cargar la próxima carrera.</p>
    <template v-else-if="nextRace">
      <p>
        <strong>{{ nextRace.name }}</strong>
      </p>
      <ul>
        <li>Fecha: {{ nextRace.date }}</li>
        <li>Circuito: {{ nextRace.venue }}</li>
        <li>Ubicación: {{ nextRace.city }} ({{ nextRace.country }})</li>
      </ul>
    </template>
    <p v-else>Datos no encontrados</p>
  </article>
</template>
