<script setup lang="ts">
import EventOverview from '@/components/events/EventOverview.vue'
import EventResults from '@/components/events/EventResults.vue'
import EventPoster from '@/components/events/EventPoster.vue'
import { useEventDetails } from '@/composables'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const eventId = computed(() => String(route.params.eventId ?? ''))
const { eventDetails, eventDetailsError, isEventDetailsLoading } = useEventDetails(eventId)
const hasResults = computed(() => Boolean(eventDetails.value?.result?.length))
const hasPoster = computed(() => Boolean(eventDetails.value?.poster))
const tabs = computed(() => [
  { id: 'eventOverview', label: 'Overview' },
  ...(hasResults.value ? [{ id: 'eventResults', label: 'Results' }] : []),
  ...(hasPoster.value ? [{ id: 'eventPoster', label: 'Poster' }] : []),
])
</script>

<template>
  <h2 v-if="eventDetails">{{ eventDetails.name }}</h2>
  <content-tabs .tabList="tabs">
    <div slot="eventOverview">
      <h3 hidden aria-hidden="false">Event overview</h3>
      <p v-if="isEventDetailsLoading" aria-busy="true">Loading event overview...</p>
      <p v-else-if="eventDetailsError">{{ eventDetailsError }}</p>
      <EventOverview v-else-if="eventDetails" :event-details="eventDetails" />
      <p v-else>No data found</p>
    </div>
    <div slot="eventResults">
      <h3 hidden aria-hidden="false">Event results</h3>
      <p v-if="isEventDetailsLoading" aria-busy="true">Loading event details...</p>
      <p v-else-if="eventDetailsError">{{ eventDetailsError }}</p>
      <EventResults v-else-if="eventDetails && hasResults" :event-details="eventDetails" />
      <p v-else>No data found</p>
    </div>
    <div slot="eventPoster">
      <h3 hidden aria-hidden="false">Event poster</h3>
      <p v-if="isEventDetailsLoading" aria-busy="true">Loading event poster...</p>
      <p v-else-if="eventDetailsError">{{ eventDetailsError }}</p>
      <EventPoster v-else-if="eventDetails && hasPoster" :event-details="eventDetails" />
      <p v-else>No data found</p>
    </div>
  </content-tabs>
</template>
