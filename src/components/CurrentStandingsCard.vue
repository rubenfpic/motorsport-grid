<script setup lang="ts">
import type { CurrentStandings } from '@/types'

defineProps<{
  currentStandings: CurrentStandings | null
  currentStandingsError: string | null
  isCurrentStandingsLoading: boolean
}>()
</script>

<template>
  <article>
    <header>
      <h3>Clasificación actual</h3>
    </header>
    <p v-if="isCurrentStandingsLoading" aria-busy="true">Cargando...</p>
    <p v-else-if="currentStandingsError">No se pudo cargar la clasificación actual.</p>
    <template v-else-if="currentStandings">
      <table>
        <thead>
          <tr>
            <th scope="col">Pos</th>
            <th scope="col">Piloto</th>
            <th scope="col">Equipo</th>
            <th scope="col">Puntos</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in currentStandings.entries"
            :key="`${entry.position}-${entry.driver}-${entry.team}`"
          >
            <td>{{ entry.position }}</td>
            <td>{{ entry.driver }}</td>
            <td>{{ entry.team }}</td>
            <td>{{ entry.points }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <p v-else>Clasificación no disponible.</p>
  </article>
</template>
