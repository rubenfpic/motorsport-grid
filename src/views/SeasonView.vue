<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import { useSeasonData } from '@/composables/useSeasonData'
import { AVAILABLE_SEASONS } from '@/constants/api'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// Usamos computed para que este valor se actualice automáticamente al cambiar la ruta.
const seasonYear = computed(() => String(route.params.season ?? ''))
const { seasonEvents, seasonEventsError, isLoading } = useSeasonData(seasonYear)
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
  <BreadcrumbsNav />
  <hr />
  <h2>Temporada {{ route.params.season }}</h2>
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
  <p v-if="isLoading" aria-busy="true">Cargando eventos de la temporada...</p>
  <p v-else-if="seasonEventsError">{{ seasonEventsError }}</p>
  <dl v-else-if="seasonEvents.length">
    <template v-for="event in seasonEvents" :key="event.id">
      <dt>
        <RouterLink
          :to="{ name: 'Event', params: { season: String(route.params.season), event: event.id } }"
          >{{ event.name }}</RouterLink
        >
      </dt>
      <dd>{{ event.date }}</dd>
      <dd>{{ event.city }} ({{ event.country }})</dd>
    </template>
  </dl>
  <p v-else>Sin datos disponibles</p>
</template>
