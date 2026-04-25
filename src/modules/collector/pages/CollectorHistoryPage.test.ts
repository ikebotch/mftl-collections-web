import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it, vi } from 'vitest'
import CollectorHistoryPage from './CollectorHistoryPage.vue'

vi.mock('../composables/useCollector', () => ({
  useCollectorHistory: () => ({
    isLoading: { value: false },
    isError: { value: false },
    error: { value: null },
    refetch: vi.fn(),
    data: {
      value: [
        {
          id: 'receipt-1',
          receiptNumber: 'RCT-1001',
          status: 'Issued',
          issuedAt: '24 Apr 2026',
          eventTitle: 'Youth Conference 2026',
          recipientFundName: 'Youth Scholarships',
          amount: 'GHS 150.00',
        },
      ],
    },
  }),
}))

describe('CollectorHistoryPage', () => {
  it('renders collector history from collector endpoint data', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/collector/history', component: CollectorHistoryPage },
        { path: '/collector/receipts/:id', component: { template: '<div />' } },
      ],
    })

    await router.push('/collector/history')

    const wrapper = mount(CollectorHistoryPage, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('History')
    expect(wrapper.text()).toContain('RCT-1001')
  })
})
