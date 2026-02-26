<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const seasonYear = computed(() => route.params.seasonYear as string | undefined)
const eventId = computed(() => route.params.eventId as string | undefined)

defineProps({
  eventName: {
    type: String,
    required: false,
    default: '',
  },
})
</script>

<template>
  <nav aria-label="breadcrumb">
    <ul>
      <li>
        <RouterLink :to="{ name: 'Dashboard' }">Dashboard</RouterLink>
      </li>
      <li v-if="seasonYear && !eventId" aria-current="page">
        {{ seasonYear }}
      </li>
      <template v-if="seasonYear && eventId">
        <li>
          <RouterLink :to="{ name: 'Season', params: { seasonYear } }">{{ seasonYear }}</RouterLink>
        </li>
        <li aria-current="page">
          {{ eventName || eventId }}
        </li>
      </template>
      <li v-if="$route.name === 'Teams'" aria-current="page">Equipos</li>
    </ul>
  </nav>
</template>
