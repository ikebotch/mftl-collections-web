import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import CollectorReceiptPage from './CollectorReceiptPage.vue'

vi.mock('@/modules/receipts/composables/useReceipts', () => ({
  useReceipt: () => ({
    isLoading: { value: false },
    isError: { value: false },
    data: {
      value: {
        receiptNumber: 'RCT-123',
        contributorName: 'Collector Donor',
        amount: 'GBP 150.00',
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
  it('renders receipt confirmation details', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/collector/history', component: { template: '<div />' } },
        { path: '/collector/receipts/:id', component: CollectorReceiptPage },
      ],
    })

    const wrapper = mount(CollectorReceiptPage, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Receipt confirmation')
    expect(wrapper.text()).toContain('Collector Donor')
    expect(wrapper.text()).toContain('Print receipt')
  })
})
