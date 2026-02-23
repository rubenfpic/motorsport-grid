<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const seasonYear = String(route.params.season)
</script>
<template>
  <nav aria-label="breadcrumb">
    <ul>
      <li>
        <RouterLink :to="{ name: 'Dashboard' }">Dashboard</RouterLink>
      </li>
      <li>Temporada {{ seasonYear }}</li>
    </ul>
  </nav>
</template>
