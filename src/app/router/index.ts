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
    redirect: '/admin',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
