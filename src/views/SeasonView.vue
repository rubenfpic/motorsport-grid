<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSeasonData } from '@/composables/useSeasonData'
import { computed } from 'vue'
import { AVAILABLE_SEASONS } from '@/constants/api'

const route = useRoute()
// Usamos computed para que este valor se actualice automáticamente al cambiar la ruta.
const seasonYear = computed(() => String(route.params.season ?? ''))
const { seasonEvents, seasonEventsError } = useSeasonData(seasonYear)
const previousSeason = computed<number | null>(() => {
  if (Number(seasonYear.value) > Number(AVAILABLE_SEASONS[0])) {
    return Number(seasonYear.value) - 1
  } else {
    return null
  }
})
const nextSeason = computed<number | null>(() => {
  if (Number(seasonYear.value) < Number(AVAILABLE_SEASONS[AVAILABLE_SEASONS.length - 1])) {
    return Number(seasonYear.value) + 1
  } else {
    return null
  }
})
</script>

<template>
  <RouterLink :to="{ name: 'Dashboard' }">← Volver al Dashboard</RouterLink>
  <hr />
  <span v-if="previousSeason !== null">
    <RouterLink :to="{ name: 'Season', params: { season: String(previousSeason) } }"
      >◀ {{ previousSeason }}</RouterLink
    >&nbsp;
  </span>
  <span v-if="nextSeason !== null">
    <RouterLink :to="{ name: 'Season', params: { season: String(nextSeason) } }"
      >{{ nextSeason }} ▶</RouterLink
    >
  </span>
  <hr />
  <h2>Temporada {{ route.params.season }}</h2>
  <dl v-if="seasonEvents.length">
    <template v-for="event in seasonEvents" :key="event.id">
      <dt>
        <strong>{{ event.name }}</strong>
      </dt>
      <dd>{{ event.date }}</dd>
      <dd>{{ event.city }} ({{ event.country }})</dd>
    </template>
  </dl>
  <p v-else-if="seasonEventsError">{{ seasonEventsError }}</p>
  <p v-else aria-busy="true">Cargando eventos de la temporada...</p>
</template>
