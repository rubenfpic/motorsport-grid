<script setup lang="ts">
import NextRaceCard from '@/components/next-race-card.vue'
import PastRaceCard from '@/components/past-race-card.vue'
import { useDashboardData } from '@/composables/useDashboardData'

const { nextRace, pastRace, nextRaceError, pastRaceError } = useDashboardData()
</script>

<template>
  <div class="grid">
    <PastRaceCard :pastRace="pastRace" :pastRaceError="pastRaceError" />
    <NextRaceCard :nextRace="nextRace" :nextRaceError="nextRaceError" />
  </div>
</template>
