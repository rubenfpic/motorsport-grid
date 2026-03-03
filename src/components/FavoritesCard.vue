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
    <header>Favoritos</header>
    <p v-if="isLoading">Cargando...</p>
    <p v-else-if="error">{{ error }}</p>
    <template v-else-if="teamId">
      <p>Equipo favorito:</p>
      <RouterLink :to="{ name: 'TeamDetails', params: { teamId: teamId } }">
        {{ teamName }}
      </RouterLink>
    </template>
    <p v-else>No hay favorito</p>
  </article>
</template>
