<script setup lang="ts">
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'
import SeasonDetails from '@/components/SeasonDetails.vue'
import { useSeasonEvents } from '@/composables'
import { AVAILABLE_SEASONS } from '@/constants/api'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// Usamos computed para que este valor se actualice automáticamente al cambiar la ruta.
const seasonYear = computed(() => String(route.params.seasonYear ?? ''))
const { seasonEvents, seasonEventsError, isLoading } = useSeasonEvents(seasonYear)
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
  <h2>Season {{ route.params.seasonYear }}</h2>
  <span v-if="previousSeason !== null">
    <RouterLink :to="{ name: 'Season', params: { seasonYear: String(previousSeason) } }"
      >◀ {{ previousSeason }}</RouterLink
    >&nbsp;
  </span>
  <span v-if="nextSeason !== null">
    <RouterLink :to="{ name: 'Season', params: { seasonYear: String(nextSeason) } }"
      >{{ nextSeason }} ▶</RouterLink
    >
  </span>
  <hr />
  <p v-if="isLoading" aria-busy="true">Loading season events...</p>
  <p v-else-if="seasonEventsError">{{ seasonEventsError }}</p>
  <SeasonDetails
    v-else-if="seasonEvents.length"
    :season-year="seasonYear"
    :season-events="seasonEvents"
  />
  <p v-else>No data available</p>
</template>
