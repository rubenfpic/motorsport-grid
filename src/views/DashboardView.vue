<script setup lang="ts">
import NextRaceCard from '@/components/NextRaceCard.vue'
import PastRaceCard from '@/components/PastRaceCard.vue'
import SeasonLinksCard from '@/components/SeasonLinksCard.vue'
import { useDashboardData } from '@/composables/useDashboardData'

const { nextRace, pastRace, nextRaceError, pastRaceError } = useDashboardData()
</script>

<template>
  <PastRaceCard :pastRace="pastRace" :pastRaceError="pastRaceError" />
  <div class="grid">
    <NextRaceCard :nextRace="nextRace" :nextRaceError="nextRaceError" />
    <SeasonLinksCard />
  </div>
</template>
