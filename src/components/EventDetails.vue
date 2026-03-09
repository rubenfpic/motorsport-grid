<script setup lang="ts">
import type { EventDetails } from '@/types'

defineProps<{
  eventDetails: EventDetails
}>()
</script>

<template>
  <h2>{{ eventDetails.name }}</h2>

  <ul>
    <li><strong>Event ID:</strong> {{ eventDetails.id }}</li>
    <li><strong>Season:</strong> {{ eventDetails.season }}</li>
    <li><strong>Venue:</strong> {{ eventDetails.venue }}</li>
    <li><strong>City:</strong> {{ eventDetails.city }}</li>
    <li><strong>Country:</strong> {{ eventDetails.country }}</li>
    <li v-if="eventDetails.date"><strong>Date:</strong> {{ eventDetails.date }}</li>
  </ul>
  <table v-if="eventDetails.result.length">
    <thead>
      <tr>
        <th scope="col">Position</th>
        <th scope="col">Driver</th>
        <th scope="col">Team</th>
        <th scope="col">Time</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="participant in eventDetails.result" :key="participant.position">
        <th scope="row">{{ participant.position }}</th>
        <td>{{ participant.driver }}</td>
        <td>{{ participant.team }}</td>
        <td>{{ participant.time }}</td>
      </tr>
    </tbody>
  </table>
  <img
    v-if="eventDetails.poster"
    :src="eventDetails.poster"
    :alt="`Poster image of ${eventDetails.name}`"
    :title="`Poster of ${eventDetails.name}`"
  />
</template>
