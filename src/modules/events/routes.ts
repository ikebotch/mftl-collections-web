import type { RouteRecordRaw } from 'vue-router'

export const eventRoutes: RouteRecordRaw[] = [
  {
    path: 'events',
    name: 'admin-events',
    component: () => import('./pages/EventListPage.vue'),
  },
  {
    path: 'events/new',
    name: 'admin-events-new',
    component: () => import('./pages/EventCreatePage.vue'),
  },
  {
    path: 'events/:id',
    name: 'admin-events-detail',
    component: () => import('./pages/EventDetailPage.vue'),
  },
  {
    path: 'events/:id/edit',
    name: 'admin-events-edit',
    component: () => import('./pages/EventEditPage.vue'),
  },
  {
    path: 'events/:id/analytics',
    name: 'admin-events-analytics',
    component: () => import('./pages/EventAnalyticsPage.vue'),
  },
  {
    path: 'events/:id/recipient-funds',
    name: 'admin-events-funds',
    component: () => import('./pages/EventRecipientFundsPage.vue'),
  },
]
