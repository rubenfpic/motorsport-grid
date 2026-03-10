<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <TheHeader />
  <main id="main-content" tabindex="-1">
    <RouterView />
  </main>
</template>
