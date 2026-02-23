<script setup lang="ts">
import { AVAILABLE_SEASONS } from '@/constants/api'
</script>

<template>
  <article>
    <header>Temporadas</header>
    <ul>
      <li v-for="season in AVAILABLE_SEASONS" :key="season">
        <RouterLink :to="{ name: 'Season', params: { season } }">{{ season }}</RouterLink>
      </li>
    </ul>
  </article>
</template>
