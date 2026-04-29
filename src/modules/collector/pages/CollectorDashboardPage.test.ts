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
      profile: {
        id: 'collector-1',
        name: 'Abena Osei',
        email: 'abena@example.com',
        status: 'Active',
        assignedEventCount: 2,
        assignedFundCount: 3,
        totalCollectedToday: 1245,
        receiptsIssuedToday: 18,
        lastActiveAt: '2026-04-24T09:42:00Z',
        hasAssignments: true,
        blockedReason: '',
      },
      assignments: {
        hasAssignments: true,
        blockedReason: '',
        events: [],
        funds: [],
      },
      todayTotal: 'GHS 1,245.00',
      receiptsIssued: 18,
      assignedEvents: 2,
      assignedFunds: 3,
      currentShiftLabel: 'Main Site',
      syncStatusLabel: 'Online',
      syncStatusDescription: 'Last activity 24 Apr 2026',
      recentReceipts: [
        {
          id: 'receipt-1',
          receiptNumber: 'RCT-1001',
          eventTitle: 'Community Fundraiser',
          recipientFundName: 'Medical Fund',
          amount: 'GHS 150.00',
          status: 'Issued',
          issuedAt: '24 Apr 2026',
        },
      ],
    },
  },
}

vi.mock('../composables/useCollector', () => ({
  useCollectorDashboard: () => dashboardState,
}))

describe('CollectorDashboardPage', () => {
  it('renders collector-scoped metrics and recent receipts', () => {
    const wrapper = mount(CollectorDashboardPage)

    expect(wrapper.text()).toContain('Abena Osei')
    expect(wrapper.text()).toContain('GHS 1,245.00')
    expect(wrapper.text()).toContain('New Collection')
    expect(wrapper.text()).toContain('RCT-1001')
  })

  it('renders blocked state when collector has no assignments', () => {
    dashboardState.data.value = {
      ...dashboardState.data.value,
      profile: {
        ...dashboardState.data.value.profile,
        hasAssignments: false,
        blockedReason: 'No event and fund assignments are active for this collector.',
      },
      assignments: {
        hasAssignments: false,
        blockedReason: 'No event and fund assignments are active for this collector.',
        events: [],
        funds: [],
      },
      recentReceipts: [],
    }

    const wrapper = mount(CollectorDashboardPage)

    expect(wrapper.text()).toContain('No active assignments found')
  })
})
