<script setup lang="ts">
import NextRaceCard from '@/components/NextRaceCard.vue'
import PastRaceCard from '@/components/PastRaceCard.vue'
import SeasonLinksCard from '@/components/SeasonLinksCard.vue'
import TeamLinksCard from '@/components/TeamLinksCard.vue'
import { useDashboard } from '@/composables/useDashboard'

const { nextRace, pastRace, nextRaceError, pastRaceError, isNextRaceLoading, isPastRaceLoading } =
  useDashboard()
</script>

<template>
  <h2>Dashboard</h2>
  <TeamLinksCard />
  <PastRaceCard
    :pastRace="pastRace"
    :pastRaceError="pastRaceError"
    :isPastRaceLoading="isPastRaceLoading"
  />
  <div class="grid">
    <NextRaceCard
      :nextRace="nextRace"
      :nextRaceError="nextRaceError"
      :isNextRaceLoading="isNextRaceLoading"
    />
    <SeasonLinksCard />
  </div>
</template>
