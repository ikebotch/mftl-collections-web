import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import CollectorReceiptPage from './CollectorReceiptPage.vue'

vi.mock('@/modules/receipts/composables/useReceipts', () => ({
  useReceipt: () => ({
    isLoading: { value: false },
    isError: { value: false },
    data: {
      value: {
        receiptNumber: 'RCT-123',
        contributorName: 'Collector Donor',
        contributorPhone: '+233241234567',
        contributorEmail: 'collector@example.com',
        collectorName: 'Abena Osei',
        isAnonymous: false,
        amount: 'GHS 150.00',
        eventTitle: 'Community Fundraiser',
        recipientFundName: 'Medical Fund',
        status: 'Issued',
        contributionStatus: 'Completed',
        paymentStatus: 'Cash',
        paymentMethod: 'Cash',
        issuedAt: '24 Apr 2026',
        note: 'Receipt note',
      },
    },
  }),
}))

describe('CollectorReceiptPage', () => {
  it('renders receipt details from live receipt data', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/collector', component: { template: '<div />' } },
        { path: '/collector/contributions/new', component: { template: '<div />' } },
        { path: '/collector/receipts/:id', component: CollectorReceiptPage },
      ],
    })

    await router.push('/collector/receipts/receipt-1')

    const wrapper = mount(CollectorReceiptPage, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Receipt')
    expect(wrapper.text()).toContain('Collector Donor')
    expect(wrapper.text()).toContain('+233241234567')
    expect(wrapper.text()).toContain('Abena Osei')
    expect(wrapper.text()).toContain('Print placeholder')
  })
})
