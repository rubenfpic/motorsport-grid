<script setup lang="ts">
import type { PastRace } from '@/types/past-race.type'

defineProps<{
  pastRace: PastRace | null
  pastRaceError: string | null
}>()
</script>

<template>
  <article>
    <header>Última carrera</header>
    <template v-if="pastRace">
      <div class="grid">
        <div>
          <p>
            <strong>{{ pastRace.name }}</strong>
          </p>
          <ul>
            <li>Fecha: {{ pastRace.date }}</li>
            <li>Circuito: {{ pastRace.venue }}</li>
            <li>Ubicación: {{ pastRace.city }} ({{ pastRace.country }})</li>
          </ul>
        </div>
        <div>
          <p><strong>Pódium:</strong></p>
          <ul>
            <li v-for="(participant, index) in pastRace.podium" :key="index">
              {{ participant.position }}. {{ participant.driver }} ({{ participant.team }})
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template v-else-if="pastRaceError">
      <p>No se pudo cargar la última carrera.</p>
    </template>
    <template v-else>
      <p aria-busy="true">Cargando...</p>
    </template>
  </article>
</template>
