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
        path: 'users/:id',
        name: 'admin-users-detail',
        component: () => import('@/modules/users/pages/AdminUserDetailPage.vue'),
      },
      {
        path: 'roles-permissions',
        name: 'admin-roles-permissions',
        component: () => import('@/modules/users/pages/RolesPermissionsPage.vue'),
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
        path: 'collectors/new',
        name: 'admin-collectors-new',
        component: () => import('@/modules/collector/pages/CollectorCreatePage.vue'),
      },
      {
        path: 'collectors/:id',
        name: 'admin-collectors-detail',
        component: () => import('@/modules/collector/pages/AdminCollectorDetailPage.vue'),
      },
      {
        path: 'collectors/:id/edit',
        name: 'admin-collectors-edit',
        component: () => import('@/modules/collector/pages/CollectorEditPage.vue'),
      },
      {
        path: 'donors',
        name: 'admin-donors',
        component: () => import('@/modules/donors/pages/DonorsPage.vue'),
      },
      {
        path: 'settlements',
        name: 'admin-settlements',
        component: () => import('@/modules/settlements/pages/SettlementsPage.vue'),
      },
    ],
  },
]
