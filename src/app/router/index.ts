import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authRoutes } from '@/modules/auth/routes'
import { adminRoutes } from '@/modules/dashboard/routes'
import { storefrontRoutes } from '@/modules/storefront/routes'
import { collectorRoutes } from '@/modules/collector/routes'

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...adminRoutes,
  ...storefrontRoutes,
  ...collectorRoutes,
  {
    path: '/',
    name: 'root',
    component: () => import('@/modules/auth/pages/AuthCallbackPage.vue'), // Reuse callback logic for routing
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
