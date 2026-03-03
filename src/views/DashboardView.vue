<script setup lang="ts">
import FavoritesCard from '@/components/FavoritesCard.vue'
import NextEventCard from '@/components/NextEventCard.vue'
import PastEventCard from '@/components/PastEventCard.vue'
import SeasonLinksCard from '@/components/SeasonLinksCard.vue'
import TeamLinksCard from '@/components/TeamLinksCard.vue'
import { useDashboard, useTeamDetails } from '@/composables'
import { useFavoriteStore } from '@/stores/useFavoriteStore'
import { computed } from 'vue'

const favorite = useFavoriteStore()
const favoriteTeamId = computed(() => favorite.favoriteTeamId)
const favoriteTeamDetails = favoriteTeamId.value ? useTeamDetails(favoriteTeamId.value) : null
const favoriteTeamName = computed(() => favoriteTeamDetails?.team.value?.name ?? 'Equipo favorito')
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
  <FavoritesCard :teamId="favoriteTeamId ?? undefined" :teamName="favoriteTeamName" />
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
