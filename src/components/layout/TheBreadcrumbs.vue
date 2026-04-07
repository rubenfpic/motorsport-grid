<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const routeName = computed(() => route.name as string | undefined)
const routeSeasonYear = computed(() => route.params.seasonYear as string | undefined)
const routeEventId = computed(() => route.params.eventId as string | undefined)
const routeTeamId = computed(() => route.params.teamId as string | undefined)
const routeDriverId = computed(() => route.params.driverId as string | undefined)

const props = defineProps({
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
  competitionName: {
    type: String,
    required: false,
    default: '',
  },
})

const breadcrumbTeamId = computed(() => props.teamId ?? Number(routeTeamId.value))
</script>

<template>
  <nav aria-label="breadcrumb">
    <ul>
      <!-- DASHBOARD -->
      <li>
        <RouterLink :to="{ name: 'Dashboard' }" :aria-busy="!competitionName?.trim()">
          {{ competitionName?.trim() ? competitionName : 'Loading...' }}
        </RouterLink>
      </li>

      <!-- SEASONS -->
      <li v-if="routeSeasonYear && !routeEventId" aria-current="page">
        {{ routeSeasonYear }}
      </li>
      <template v-if="routeSeasonYear && routeEventId">
        <!-- SEASON -->
        <li>
          <RouterLink :to="{ name: 'Season', params: { seasonYear: routeSeasonYear } }">{{
            routeSeasonYear
          }}</RouterLink>
        </li>

        <!-- EVENT -->
        <li aria-current="page">
          {{ eventName || routeEventId }}
        </li>
      </template>

      <!-- TEAMS -->
      <li v-if="routeName === 'Teams'" aria-current="page">Teams</li>
      <template v-if="teamName || routeTeamId">
        <!-- TEAMS -->
        <li>
          <RouterLink :to="{ name: 'Teams' }">Teams</RouterLink>
        </li>

        <!-- TEAM -->
        <li v-if="(teamName || routeTeamId) && !driverName && !routeDriverId" aria-current="page">
          {{ teamName || routeTeamId }}
        </li>

        <template v-if="driverName || routeDriverId">
          <!-- TEAM -->
          <li>
            <RouterLink
              v-if="breadcrumbTeamId"
              :to="{ name: 'TeamDetails', params: { teamId: breadcrumbTeamId } }"
            >
              {{ teamName || routeTeamId }}
            </RouterLink>
            <template v-else>{{ teamName || routeTeamId }}</template>
          </li>

          <!-- DRIVER -->
          <li aria-current="page">
            {{ driverName || routeDriverId }}
          </li>
        </template>
      </template>
    </ul>
  </nav>
  <hr />
</template>
