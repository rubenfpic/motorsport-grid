<script setup lang="ts">
import FavoritesCard from '@/components/FavoritesCard.vue'
import NextEventCard from '@/components/NextEventCard.vue'
import PastEventCard from '@/components/PastEventCard.vue'
import SeasonLinksCard from '@/components/SeasonLinksCard.vue'
import TeamLinksCard from '@/components/TeamLinksCard.vue'
import { useDashboard, useFavoriteTeam } from '@/composables'

const { favoriteTeam, error, isLoading, isEmpty } = useFavoriteTeam()
const {
  nextEvent,
  pastEvent,
  nextEventError,
  pastEventError,
  isNextEventLoading,
  isPastEventLoading,
} = useDashboard()
</script>

<template>
  <h2>Dashboard</h2>
  <FavoritesCard
    :team-id="favoriteTeam?.id"
    :team-name="favoriteTeam?.name ?? ''"
    :is-loading="isLoading"
    :error="error"
    :is-empty="isEmpty"
  />
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
