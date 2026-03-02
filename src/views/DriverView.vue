<script setup lang="ts">
import { useDriverDetails } from '@/composables/useDriverDetails'
import { useRoute } from 'vue-router'
import BreadcrumbsNav from '@/components/BreadcrumbsNav.vue'

const route = useRoute()
const driverId = Number(route.params.driverId)
const { driverDetails, driverDetailsError, isLoading } = useDriverDetails(driverId)
</script>

<template>
  <BreadcrumbsNav
    :team-id="driverDetails?.teamId ?? undefined"
    :team-name="driverDetails?.team ?? ''"
    :driver-name="driverDetails?.name ?? String(route.params.driverId ?? '')"
  />
  <hr />
  <p v-if="isLoading" aria-busy="true">Cargando detalles del piloto...</p>
  <p v-else-if="driverDetailsError">{{ driverDetailsError }}</p>
  <template v-else-if="driverDetails">
    <ul>
      <!-- <li>Id: {{ driverDetails.id }}</li> -->
      <li><strong>Nombre:</strong> {{ driverDetails.name }}</li>
      <!-- <li>teamId {{ driverDetails.teamId }}</li> -->
      <li><strong>Equipo:</strong> {{ driverDetails.team }}</li>
      <li><strong>Nacionalidad:</strong> {{ driverDetails.nationality }}</li>
    </ul>
    <div class="grid">
      <p>{{ driverDetails.description }}</p>
      <img
        v-if="driverDetails.photo"
        :src="driverDetails.photo"
        :alt="`Imagen del póster de ${driverDetails.name}`"
        :title="`Póster de ${driverDetails.name}`"
      />
    </div>
  </template>
  <p v-else>Datos no encontrados</p>
</template>
