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
]
