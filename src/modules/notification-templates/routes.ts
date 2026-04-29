import type { RouteRecordRaw } from 'vue-router'

export const notificationTemplateRoutes: RouteRecordRaw[] = [
  {
    path: 'settings/notification-templates',
    name: 'admin-notification-templates',
    component: () => import('./pages/NotificationTemplatesPage.vue'),
    meta: {
      permission: 'notification-templates.view'
    }
  }
]
