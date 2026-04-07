<script setup lang="ts">
import type { EventDetails } from '@/types'

defineProps<{
  eventDetails: EventDetails
}>()
</script>

<template>
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
</template>
