<script setup lang="ts">
import { SeasonService } from '@/services/season.service'
import type { SeasonEvent } from '@/types/season-event.type'
import { onMounted, ref } from 'vue'

const seasonEvents = ref<SeasonEvent[]>([])
const seasonEventsError = ref<string>('')
const seasonService = new SeasonService()

const loadSeasonEventsData = async () => {
  seasonEventsError.value = ''
  try {
    seasonEvents.value = await seasonService.getSeasonEvents()
  } catch (error) {
    console.error('Error al obtener los eventos de la temporada:', error)
    seasonEventsError.value = 'No se pudieron cargar los eventos de la temporada.'
  }
}

onMounted(loadSeasonEventsData)
</script>

<template>
  <p>
    SEASON VIEW: <strong>{{ $route.params.season }}</strong> es el año.
  </p>
  <div v-for="event in seasonEvents" :key="event.id">
    <p>{{ event.name }}</p>
  </div>
</template>
