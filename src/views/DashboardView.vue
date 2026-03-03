<script setup lang="ts">
import NextEventCard from '@/components/NextEventCard.vue'
import PastEventCard from '@/components/PastEventCard.vue'
import SeasonLinksCard from '@/components/SeasonLinksCard.vue'
import TeamLinksCard from '@/components/TeamLinksCard.vue'
import { useDashboard } from '@/composables'

const { nextEvent, pastEvent, nextEventError, pastEventError, isNextEventLoading, isPastEventLoading } =
  useDashboard()
</script>

<template>
  <h2>Dashboard</h2>
  <TeamLinksCard />
  <PastEventCard
    :pastEvent="pastEvent"
    :pastEventError="pastEventError"
    :isPastEventLoading="isPastEventLoading"
  />
  <div class="grid">
    <NextEventCard
      :nextEvent="nextEvent"
      :nextEventError="nextEventError"
      :isNextEventLoading="isNextEventLoading"
    />
    <SeasonLinksCard />
  </div>
</template>
