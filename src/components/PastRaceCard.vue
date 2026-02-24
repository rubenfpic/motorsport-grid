<script setup lang="ts">
import type { PastRace } from '@/types/past-race.type'

defineProps<{
  pastRace: PastRace | null
  pastRaceError: string | null
  isPastRaceLoading: boolean
}>()
</script>

<template>
  <article>
    <header>Última carrera</header>
    <p v-if="isPastRaceLoading" aria-busy="true">Cargando...</p>
    <p v-else-if="pastRaceError">No se pudo cargar la última carrera.</p>
    <template v-else-if="pastRace">
      <div class="grid">
        <div>
          <p>{{ pastRace.name }}</p>
          <ul>
            <li>Fecha: {{ pastRace.date }}</li>
            <li>Circuito: {{ pastRace.venue }}</li>
            <li>Ubicación: {{ pastRace.city }} ({{ pastRace.country }})</li>
          </ul>
        </div>
        <div>
          <p>Pódium:</p>
          <ul>
            <li v-for="(participant, index) in pastRace.podium" :key="index">
              {{ participant.position }}. {{ participant.driver }} ({{ participant.team }})
            </li>
          </ul>
        </div>
      </div>
    </template>
    <p v-else>Datos no encontrados</p>
  </article>
</template>
