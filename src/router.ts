import DashboardView from '@/views/DashboardView.vue'
import SeasonView from '@/views/SeasonView.vue'
import EventView from '@/views/EventView.vue'
import TeamsView from '@/views/TeamsView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { AVAILABLE_SEASONS } from '@/constants/api'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/season/:seasonYear(' + AVAILABLE_SEASONS.join('|') + ')',
    name: 'Season',
    component: SeasonView,
  },
  {
    path: '/season/:seasonYear/event/:eventId',
    name: 'Event',
    component: EventView,
  },
  { path: '/teams', name: 'Teams', component: TeamsView },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
