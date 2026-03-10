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
  teamName: {
    type: String,
    required: false,
    default: '',
  },
  teamId: {
    type: Number,
    required: false,
    default: null,
  },
  driverName: {
    type: String,
    required: false,
    default: '',
  },
})
</script>

<template>
  <nav aria-label="breadcrumb">
    <ul>
      <!-- DASHBOARD -->
      <li>
        <RouterLink :to="{ name: 'Dashboard' }">Dashboard</RouterLink>
      </li>

      <!-- SEASONS -->
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

      <!-- TEAMS -->
      <li v-if="$route.name === 'Teams'" aria-current="page">Teams</li>
      <template v-if="teamName">
        <li>
          <RouterLink :to="{ name: 'Teams' }">Teams</RouterLink>
        </li>
        <li v-if="teamName && !driverName" aria-current="page">
          {{ teamName }}
        </li>
        <template v-if="driverName">
          <li>
            <RouterLink v-if="teamId" :to="{ name: 'TeamDetails', params: { teamId } }">
              {{ teamName }}
            </RouterLink>
            <template v-else>{{ teamName }}</template>
          </li>
          <li aria-current="page">
            {{ driverName }}
          </li>
        </template>
      </template>
    </ul>
  </nav>
</template>
