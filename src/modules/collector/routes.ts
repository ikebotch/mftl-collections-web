import type { RouteRecordRaw } from 'vue-router'
import { requireAuth } from '@/core/auth/authGuards'

export const collectorRoutes: RouteRecordRaw[] = [
  {
    path: '/collector',
    component: () => import('@/surfaces/collector/layouts/CollectorLayout.vue'),
    beforeEnter: requireAuth,
    children: [
      {
        path: '',
        name: 'collector-dashboard',
        component: () => import('./pages/CollectorDashboardPage.vue'),
      },
      {
        path: 'events',
        name: 'collector-events',
        component: () => import('./pages/CollectorEventsPage.vue'),
      },
      {
        path: 'events/:id',
        name: 'collector-events-detail',
        component: () => import('./pages/CollectorEventDetailPage.vue'),
      },
      {
        path: 'contributions/new',
        name: 'collector-contribution-new',
        component: () => import('./pages/CollectorContributionCreatePage.vue'),
      },
      {
        path: 'receipts/:id',
        name: 'collector-receipt',
        component: () => import('./pages/CollectorReceiptPage.vue'),
      },
      {
        path: 'history',
        name: 'collector-history',
        component: () => import('./pages/CollectorHistoryPage.vue'),
      },
    ],
  },
]
