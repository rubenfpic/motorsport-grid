<script setup lang="ts">
import type { PastEvent } from '@/types'

defineProps<{
  pastEvent: PastEvent | null
  pastEventError: string | null
  isPastEventLoading: boolean
}>()
</script>

<template>
  <article>
    <header>
      <h3>Última carrera</h3>
    </header>
    <p v-if="isPastEventLoading" aria-busy="true">Cargando...</p>
    <p v-else-if="pastEventError">No se pudo cargar la última carrera.</p>
    <template v-else-if="pastEvent">
      <div class="grid">
        <div>
          <p>{{ pastEvent.name }}</p>
          <ul>
            <li>Fecha: {{ pastEvent.date }}</li>
            <li>Circuito: {{ pastEvent.venue }}</li>
            <li>Ubicación: {{ pastEvent.city }} ({{ pastEvent.country }})</li>
          </ul>
        </div>
        <div>
          <p>Pódium:</p>
          <ul>
            <li v-for="(participant, index) in pastEvent.podium" :key="index">
              {{ participant.position }}. {{ participant.driver }} ({{ participant.team }})
            </li>
          </ul>
        </div>
      </div>
    </template>
    <p v-else>Datos no encontrados</p>
  </article>
</template>
