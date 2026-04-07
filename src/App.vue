<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/layout/TheHeader.vue'
import { onMounted, watch } from 'vue'
import { useCompetitionStore } from './stores/useCompetitionStore'

const competitionStore = useCompetitionStore()

const applyCompetitionTheme = () => {
  document.documentElement.dataset.competition = competitionStore.competitionId
}

onMounted(applyCompetitionTheme)
watch(() => competitionStore.competitionId, applyCompetitionTheme)
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <TheHeader />
  <main id="main-content" tabindex="-1">
    <RouterView />
  </main>
</template>
