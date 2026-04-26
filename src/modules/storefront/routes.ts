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
        path: 'recipient',
        name: 'storefront-recipient',
        component: () => import('./pages/RecipientSelectionPage.vue'),
      },
      {
        path: 'details',
        name: 'storefront-details',
        component: () => import('./pages/ContributionDetailsPage.vue'),
      },
      {
        path: 'payment',
        name: 'storefront-payment',
        component: () => import('./pages/PaymentMethodPage.vue'),
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
