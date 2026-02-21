<script setup lang="ts">
import { SeasonService } from '@/services/season.service'
import type { SeasonEvent } from '@/types/season-event.type'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const seasonEvents = ref<SeasonEvent[]>([])
const seasonEventsError = ref<string>('')
const seasonService = new SeasonService()
const route = useRoute()

const loadSeasonEventsData = async () => {
  seasonEventsError.value = ''
  const season = String(route.params.season ?? '')

  try {
    seasonEvents.value = await seasonService.getSeasonEvents(season)
  } catch (error) {
    console.error('Error al obtener los eventos de la temporada:', error)
    seasonEventsError.value = 'No se pudieron cargar los eventos de la temporada.'
  }
}

onMounted(loadSeasonEventsData)
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
