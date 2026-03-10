<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <main id="main-content" tabindex="-1">
    <RouterView />
  </main>
</template>
