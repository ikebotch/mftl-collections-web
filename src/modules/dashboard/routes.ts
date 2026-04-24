import type { RouteRecordRaw } from 'vue-router'
import { requireAuth } from '@/core/auth/authGuards'
import { eventRoutes } from '@/modules/events/routes'
import { recipientFundRoutes } from '@/modules/recipient-funds/routes'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/surfaces/admin/layouts/AdminLayout.vue'),
    beforeEnter: requireAuth,
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('./pages/AdminDashboardPage.vue'),
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard-explicit',
        component: () => import('./pages/AdminDashboardPage.vue'),
      },
      ...eventRoutes,
      ...recipientFundRoutes,
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/modules/users/pages/UsersPage.vue'),
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/modules/tenants/pages/TenantSettingsPage.vue'),
      },
      {
        path: 'self-donations',
        name: 'admin-self-donations',
        component: () => import('@/modules/self-donations/pages/SelfDonationAdminPage.vue'),
      },
      {
        path: 'contributions',
        name: 'admin-contributions',
        component: () => import('@/modules/contributions/pages/ContributionsPage.vue'),
      },
      {
        path: 'payments',
        name: 'admin-payments',
        component: () => import('@/modules/payments/pages/PaymentsPage.vue'),
      },
      {
        path: 'receipts',
        name: 'admin-receipts',
        component: () => import('@/modules/receipts/pages/ReceiptsPage.vue'),
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('@/modules/reports/pages/ReportsPage.vue'),
      },
      {
        path: 'collectors',
        name: 'admin-collectors',
        component: () => import('@/modules/collector/pages/AdminCollectorsPage.vue'),
      },
      {
        path: 'settlements',
        name: 'admin-settlements',
        component: () => import('@/modules/settlements/pages/SettlementsPage.vue'),
      },
    ],
  },
]
