<script setup lang="ts">
import type { NextEvent } from '@/types'

defineProps<{
  nextEvent: NextEvent | null
  nextEventError: string | null
  isNextEventLoading: boolean
}>()
</script>

<template>
  <article>
    <header>
      <h3>Próxima carrera</h3>
    </header>
    <p v-if="isNextEventLoading" aria-busy="true">Cargando...</p>
    <p v-else-if="nextEventError">No se pudo cargar la próxima carrera.</p>
    <template v-else-if="nextEvent">
      <p>{{ nextEvent.name }}</p>
      <ul>
        <li>Fecha: {{ nextEvent.date }}</li>
        <li>Circuito: {{ nextEvent.venue }}</li>
        <li>Ubicación: {{ nextEvent.city }} ({{ nextEvent.country }})</li>
      </ul>
    </template>
    <p v-else>Datos no encontrados</p>
  </article>
</template>
