import DashboardView from '@/views/DashboardView.vue'
import SeasonView from '@/views/SeasonView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { AVAILABLE_SEASONS } from '@/constants/api'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/season', redirect: '/' },
  {
    path: '/season/:season(' + AVAILABLE_SEASONS.join('|') + ')',
    name: 'Season',
    component: SeasonView,
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
