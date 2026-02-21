import DashboardView from '@/views/DashboardView.vue'
import SeasonView from '@/views/SeasonView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/season/:season', name: 'Season', component: SeasonView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
