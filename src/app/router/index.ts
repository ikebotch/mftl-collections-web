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
        },
        {
          path: 'events',
          name: 'admin-events',
          component: () => import('../../surfaces/admin/views/events/EventListView.vue')
        },
        {
          path: 'events/new',
          name: 'admin-events-new',
          component: () => import('../../surfaces/admin/views/events/EventCreateView.vue')
        },
        {
          path: 'events/:id',
          name: 'admin-events-detail',
          component: () => import('../../surfaces/admin/views/events/EventDetailView.vue')
        },
        {
          path: 'events/:id/recipient-funds/new',
          name: 'admin-recipient-funds-new',
          component: () => import('../../surfaces/admin/views/recipient-funds/RecipientFundCreateView.vue')
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
