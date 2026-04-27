import type { RouteRecordRaw } from 'vue-router'

export const storefrontRoutes: RouteRecordRaw[] = [
  {
    path: '/give/:eventSlug',
    alias: '/contribute/:eventSlug',
    component: () => import('@/surfaces/storefront/layouts/StorefrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'storefront-landing',
        component: () => import('./pages/StorefrontLandingPage.vue'),
      },
      {
        path: 'contribute',
        name: 'storefront-contribute',
        component: () => import('./pages/StorefrontContributionPage.vue'),
      },
      {
        path: 'recipient',
        redirect: { name: 'storefront-contribute' }
      },
      {
        path: 'details',
        redirect: { name: 'storefront-contribute' }
      },
      {
        path: 'payment',
        redirect: { name: 'storefront-contribute' }
      },
      {
        path: 'confirm',
        name: 'storefront-confirm',
        component: () => import('./pages/ContributionConfirmPage.vue'),
      },
      {
        path: 'success',
        name: 'storefront-success',
        component: () => import('./pages/ContributionSuccessPage.vue'),
      },
      {
        path: 'self',
        name: 'storefront-self',
        component: () => import('@/modules/self-donations/pages/SelfDonationLandingPage.vue'),
      },
    ],
  },
]
