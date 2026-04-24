import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CollectorDashboardPage from './CollectorDashboardPage.vue'

const dashboardState = {
  isLoading: { value: false },
  isError: { value: false },
  error: { value: null },
  refetch: vi.fn(),
  data: {
    value: {
      totalCollected: 'GHS 150.00',
      contributionCount: '1',
      assignedEvents: '2',
      recentReceipts: [
        {
          id: 'receipt-1',
          receiptNumber: 'RCT-1001',
          eventTitle: 'Community Fundraiser',
          amount: 'GHS 150.00',
          status: 'Issued',
        },
      ],
    },
  },
}

vi.mock('../composables/useCollector', () => ({
  useCollectorDashboard: () => dashboardState,
}))

describe('CollectorDashboardPage', () => {
  it('renders live collector dashboard metrics', () => {
    const wrapper = mount(CollectorDashboardPage)

    expect(wrapper.text()).toContain('Total collected')
    expect(wrapper.text()).toContain('GHS 150.00')
    expect(wrapper.text()).toContain('RCT-1001')
  })

  it('renders the empty state when no recent receipts exist', async () => {
    dashboardState.data.value = {
      totalCollected: 'GBP 0.00',
      contributionCount: '0',
      assignedEvents: '0',
      recentReceipts: [],
    }

    const wrapper = mount(CollectorDashboardPage)

    expect(wrapper.text()).toContain('No contributions recorded yet')
  })
})
