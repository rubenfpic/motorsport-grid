<script setup lang="ts">
import NextRaceCard from '@/components/NextRaceCard.vue'
import PastRaceCard from '@/components/PastRaceCard.vue'
import { useDashboardData } from '@/composables/useDashboardData'
const { nextRace, pastRace, nextRaceError, pastRaceError } = useDashboardData()
</script>

<template>
  <div class="grid">
    <PastRaceCard :pastRace="pastRace" :pastRaceError="pastRaceError" />
    <NextRaceCard :nextRace="nextRace" :nextRaceError="nextRaceError" />
  </div>
</template>
