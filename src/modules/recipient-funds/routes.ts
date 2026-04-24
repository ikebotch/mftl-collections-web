import type { RouteRecordRaw } from 'vue-router'

export const recipientFundRoutes: RouteRecordRaw[] = [
  {
    path: 'events/:id/recipient-funds',
    name: 'admin-recipient-funds',
    component: () => import('./pages/RecipientFundListPage.vue'),
  },
  {
    path: 'events/:id/recipient-funds/new',
    name: 'admin-recipient-funds-new',
    component: () => import('./pages/RecipientFundCreatePage.vue'),
  },
]
