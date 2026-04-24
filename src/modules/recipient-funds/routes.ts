import type { RouteRecordRaw } from 'vue-router'

export const recipientFundRoutes: RouteRecordRaw[] = [
  {
    path: 'funds',
    name: 'admin-funds',
    component: () => import('./pages/RecipientFundListPage.vue'),
  },
  {
    path: 'funds/new',
    name: 'admin-funds-new',
    component: () => import('./pages/RecipientFundCreatePage.vue'),
  },
  {
    path: 'funds/:id',
    name: 'admin-funds-detail',
    component: () => import('./pages/RecipientFundDetailPage.vue'),
  },
  {
    path: 'funds/:id/edit',
    name: 'admin-funds-edit',
    component: () => import('./pages/RecipientFundEditPage.vue'),
  },
]
