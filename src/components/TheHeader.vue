<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useCompetitionStore } from '@/stores/useCompetitionStore'
import TheBreadcrumbs from './TheBreadcrumbs.vue'
import { useRoute } from 'vue-router'
import { AVAILABLE_LEAGUES } from '@/constants/api'
import EventService from '@/services/event.service'
import { TeamService } from '@/services/team.service'
import { DriverService } from '@/services/driver.service'

const route = useRoute()
// const routeSeasonYear = computed(() => route.params.seasonYear as string | undefined)
const routeEventId = computed(() => route.params.eventId as string | undefined)
const routeTeamId = computed(() => route.params.teamId as string | undefined)
const routeDriverId = computed(() => route.params.driverId as string | undefined)

const eventName = ref('')
const teamName = ref('')
const driverName = ref('')

const teamIdFromDriver = ref<number | null>(null)
const resolvedTeamId = computed<number | null>(() => {
  if (routeTeamId.value) return Number(routeTeamId.value)
  return teamIdFromDriver.value
})

const eventService = new EventService()
const teamService = new TeamService()
const driverService = new DriverService()

const competitionStore = useCompetitionStore()
const competitionName = computed(() => competitionStore.competitionName)
const isDashboard = computed(() => route.name === 'Dashboard')
const availableCompetitions = computed(() => competitionStore.availableCompetitionsMeta)

const loadEventName = async () => {
  eventName.value = ''

  if (!routeEventId.value) return

  try {
    const event = await eventService.getEventById(routeEventId.value)

    eventName.value = event?.name ?? ''
  } catch (error) {
    console.error('Error al cargar los detalles del evento:', error)
  }
}

const loadTeamName = async () => {
  teamName.value = ''

  if (!resolvedTeamId.value) return

  try {
    const team = await teamService.getTeamById(Number(resolvedTeamId.value))

    teamName.value = team?.name ?? ''
  } catch (error) {
    console.error('Error al cargar los detalles del equipo:', error)
  }
}

const loadDriverName = async () => {
  driverName.value = ''
  teamIdFromDriver.value = null

  if (!routeDriverId.value) return

  try {
    const driver = await driverService.getDriverById(Number(routeDriverId.value))

    driverName.value = driver?.name ?? ''
    teamIdFromDriver.value = driver?.teamId ?? null
  } catch (error) {
    console.error('Error al cargar los detalles del piloto:', error)
  }
}

onMounted(() => {
  competitionStore.loadAvailableCompetitionsMeta()
  if (!competitionStore.competitionName) {
    competitionStore.loadCompetitionMeta()
  }
  loadEventName()
  loadTeamName()
  loadDriverName()
})

watch(() => routeEventId.value, loadEventName)
watch(() => resolvedTeamId.value, loadTeamName)
watch(() => routeDriverId.value, loadDriverName)
</script>

<template>
  <header>
    <nav v-if="isDashboard" class="dock" aria-label="Competition selector">
      <button
        v-for="leagueId in AVAILABLE_LEAGUES"
        :key="leagueId"
        type="button"
        class="dock__item"
        :class="{ 'is-active': leagueId === competitionStore.competitionId }"
        :aria-label="availableCompetitions[leagueId]?.name ?? `Competition ${leagueId}`"
        @click="competitionStore.setCompetitionId(leagueId)"
      >
        <img
          v-if="availableCompetitions[leagueId]?.badge"
          :src="availableCompetitions[leagueId].badge"
          :alt="availableCompetitions[leagueId].name"
          :title="`Show ${availableCompetitions[leagueId].name}`"
          class="dock__badge"
        />
      </button>
    </nav>
    <TheBreadcrumbs
      v-if="!isDashboard"
      :competition-name="competitionName"
      :event-name="eventName"
      :team-name="teamName"
      :driver-name="driverName"
      :team-id="resolvedTeamId ?? undefined"
    />
  </header>
</template>
