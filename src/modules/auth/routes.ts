import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('./pages/AuthCallbackPage.vue'),
  },
  {
    path: '/pending-access',
    name: 'pending-access',
    component: () => import('./pages/PendingAccessPage.vue'),
  },
]
