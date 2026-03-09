<script setup lang="ts">
import { AVAILABLE_SEASONS } from '@/constants/api'
</script>

<template>
  <article>
    <header>
      <h3>Temporadas</h3>
    </header>
    <ul>
      <li v-for="season in AVAILABLE_SEASONS" :key="season">
        <RouterLink :to="{ name: 'Season', params: { seasonYear: season } }">{{ season }}</RouterLink>
      </li>
    </ul>
  </article>
</template>
