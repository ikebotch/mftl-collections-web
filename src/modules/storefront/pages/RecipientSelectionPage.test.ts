import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import RecipientSelectionPage from './RecipientSelectionPage.vue'
import { useContributionFlowStore } from '../store/contributionFlowStore'

vi.mock('../composables/useStorefront', () => ({
  useStorefrontRecipientFunds: () => ({
    isLoading: { value: false },
    data: {
      value: [
        { id: 'fund-1', name: 'Medical support', description: 'Support care', targetAmount: 500, currency: 'GBP' },
      ],
    },
  }),
}))

describe('RecipientSelectionPage', () => {
  it('renders recipient selection cards', () => {
    setActivePinia(createPinia())
    const store = useContributionFlowStore()
    store.initialise('event-slug')
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/contribute/:eventSlug/recipient', component: RecipientSelectionPage }],
    })

    const wrapper = mount(RecipientSelectionPage, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    expect(wrapper.text()).toContain('Medical support')
  })
})
