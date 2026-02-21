<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSeasonData } from '@/composables/useSeasonData'
import { computed } from 'vue'

const route = useRoute()
// Usamos computed para que este valor se actualice automáticamente al cambiar la ruta.
const seasonYear = computed(() => String(route.params.season ?? ''))
const { seasonEvents, seasonEventsError } = useSeasonData(seasonYear)
</script>

<template>
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
