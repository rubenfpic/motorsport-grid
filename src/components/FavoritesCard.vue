<script setup lang="ts">
defineProps({
  teamId: {
    type: Number,
    required: false,
    default: null,
  },
  teamName: {
    type: String,
    required: false,
    default: '',
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
  error: {
    type: String,
    required: false,
    default: '',
  },
  isEmpty: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>

<template>
  <article>
    <header>
      <h3>Favorites</h3>
    </header>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>
    <template v-else-if="teamId">
      <p>Favorite team:</p>
      <RouterLink :to="{ name: 'TeamDetails', params: { teamId: teamId } }">
        {{ teamName }}
      </RouterLink>
    </template>
    <template v-else>
      <p>No favorite selected</p>
      <RouterLink :to="{ name: 'Teams' }">Browse teams</RouterLink>
    </template>
  </article>
</template>
