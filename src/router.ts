import DashboardView from '@/views/DashboardView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [{ path: '/', name: 'Dashboard', component: DashboardView }]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
