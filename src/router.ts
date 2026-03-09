import { AVAILABLE_SEASONS } from '@/constants/api'
import DashboardView from '@/views/DashboardView.vue'
import EventView from '@/views/EventView.vue'
import SeasonView from '@/views/SeasonView.vue'
import TeamsView from '@/views/TeamsView.vue'
import TeamView from '@/views/TeamView.vue'
import DriverView from '@/views/DriverView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: { name: 'Dashboard' },
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
  {
    path: '/teams',
    name: 'Teams',
    component: TeamsView,
  },
  {
    path: '/teams/:teamId',
    name: 'TeamDetails',
    component: TeamView,
  },
  {
    path: '/drivers/:driverId',
    name: 'DriverDetails',
    component: DriverView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
