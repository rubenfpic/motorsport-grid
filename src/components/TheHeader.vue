<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCompetitionStore } from '@/stores/useCompetitionStore'
import TheBreadcrumbs from './TheBreadcrumbs.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const competitionStore = useCompetitionStore()
const competitionName = computed(() => competitionStore.competitionName)
const isDashboard = computed(() => route.name === 'Dashboard')

onMounted(() => {
  if (!competitionStore.competitionName) {
    competitionStore.loadCompetitionMeta()
  }
})
</script>

<template>
  <header>
    <TheBreadcrumbs v-if="!isDashboard" :competition-name="competitionName" />
  </header>
</template>
