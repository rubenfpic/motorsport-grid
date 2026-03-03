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
})
</script>

<template>
  <article>
    <header>Favoritos</header>
    <template v-if="teamId">
      <p>Equipo favorito:</p>
      <RouterLink :to="{ name: 'TeamDetails', params: { teamId: teamId } }">
        {{ teamName }}
      </RouterLink>
    </template>
    <p v-else>No hay favorito</p>
  </article>
</template>
