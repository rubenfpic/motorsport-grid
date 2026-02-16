<script setup lang="ts">
import NextRaceCard from '@/components/next-race-card.vue'
import PastRaceCard from '@/components/past-race-card.vue'
import { DtmService } from '@/services/dtm.service'
import type { NextRace } from '@/types/next-race.type'
import type { PastRace } from '@/types/past-race.type'
import { onMounted, ref } from 'vue'

const nextRace = ref<NextRace | null>(null)
const nextRaceError = ref<string | null>(null)
const pastRace = ref<PastRace | null>(null)
const pastRaceError = ref<string | null>(null)

onMounted(async () => {
  const dtmService = new DtmService()

  try {
    const nextRaceData = await dtmService.getNextRace()
    nextRace.value = nextRaceData
    console.log('Próxima carrera con async/await:', nextRaceData)
  } catch (error) {
    console.error('Error al obtener la próxima carrera:', error)
    nextRaceError.value = 'Error al obtener la próxima carrera'
  }

  try {
    const pastRaceData = await dtmService.getPastRace()
    pastRace.value = pastRaceData
    console.log('Última carrera con async/await:', pastRaceData)
  } catch (error) {
    console.error('Error al obtener la última carrera:', error)
    pastRaceError.value = 'Error al obtener la última carrera'
  }
})
</script>

<template>
  <div class="grid">
    <PastRaceCard :pastRace="pastRace" :pastRaceError="pastRaceError" />
    <NextRaceCard :nextRace="nextRace" :nextRaceError="nextRaceError" />
  </div>
</template>
