<script setup lang="ts">
import CurrentStandingsCard from '@/components/dashboard/CurrentStandingsCard.vue'
import FavoritesCard from '@/components/dashboard/FavoritesCard.vue'
import NextEventCard from '@/components/dashboard/NextEventCard.vue'
import PastEventCard from '@/components/dashboard/PastEventCard.vue'
import SeasonLinksCard from '@/components/dashboard/SeasonLinksCard.vue'
import { useDashboard, useFavoriteTeam } from '@/composables'

const { favoriteTeam, error, isLoading, isEmpty } = useFavoriteTeam()
const {
  nextEvent,
  pastEvent,
  currentStandings,
  nextEventError,
  pastEventError,
  currentStandingsError,
  isNextEventLoading,
  isPastEventLoading,
  isCurrentStandingsLoading,
} = useDashboard()
</script>

<template>
  <h2 class="visually-hidden">Dashboard</h2>
  <div class="dashboard">
    <div class="dashboard__last-race">
      <PastEventCard
        :pastEvent="pastEvent"
        :pastEventError="pastEventError"
        :isPastEventLoading="isPastEventLoading"
      />
    </div>
    <div class="dashboard__next-race">
      <NextEventCard
        :nextEvent="nextEvent"
        :nextEventError="nextEventError"
        :isNextEventLoading="isNextEventLoading"
      />
    </div>
    <div class="dashboard__standings">
      <CurrentStandingsCard
        :currentStandings="currentStandings"
        :currentStandingsError="currentStandingsError"
        :isCurrentStandingsLoading="isCurrentStandingsLoading"
      />
    </div>
    <div class="dashboard__favorite">
      <FavoritesCard
        :team-id="favoriteTeam?.id"
        :team-name="favoriteTeam?.name ?? ''"
        :is-loading="isLoading"
        :error="error"
        :is-empty="isEmpty"
      />
    </div>
    <div class="dashboard__seasons">
      <SeasonLinksCard />
    </div>
  </div>
</template>
