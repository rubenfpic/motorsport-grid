<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCompetitionStore } from '@/stores/useCompetitionStore'
import TheBreadcrumbs from './TheBreadcrumbs.vue'
import { useRoute } from 'vue-router'
import { AVAILABLE_LEAGUES } from '@/constants/api'

const route = useRoute()
const competitionStore = useCompetitionStore()
const competitionName = computed(() => competitionStore.competitionName)
const isDashboard = computed(() => route.name === 'Dashboard')
const availableCompetitions = computed(() => competitionStore.availableCompetitionsMeta)

console.log('availableCompetitions', availableCompetitions)
onMounted(() => {
  competitionStore.loadAvailableCompetitionsMeta()
  if (!competitionStore.competitionName) {
    competitionStore.loadCompetitionMeta()
  }
})
</script>

<template>
  <header>
    <nav v-if="isDashboard" class="dock" aria-label="Competition selector">
      <button
        v-for="leagueId in AVAILABLE_LEAGUES"
        :key="leagueId"
        type="button"
        class="dock__item"
        :class="{ 'is-active': leagueId === competitionStore.competitionId }"
        @click="competitionStore.setCompetitionId(leagueId)"
      >
        {{ availableCompetitions[leagueId]?.name }}
      </button>
    </nav>
    <TheBreadcrumbs v-if="!isDashboard" :competition-name="competitionName" />
  </header>
</template>
