import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '../../core/auth/authGuard'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth/callback',
      name: 'callback',
      component: () => import('../../surfaces/auth/views/CallbackView.vue')
    },
    {
      path: '/admin',
      component: () => import('../../surfaces/admin/layouts/AdminLayout.vue'),
      beforeEnter: authGuard,
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../../surfaces/admin/views/DashboardView.vue')
        }
      ]
    },
    {
      path: '/contribute/:eventSlug',
      name: 'storefront',
      component: () => import('../../surfaces/storefront/layouts/StorefrontLayout.vue')
    },
    {
      path: '/collector',
      name: 'collector',
      component: () => import('../../surfaces/collector/layouts/CollectorLayout.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/',
      redirect: '/admin'
    }
  ]
})
