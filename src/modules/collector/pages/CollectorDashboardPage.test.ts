import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CollectorDashboardPage from './CollectorDashboardPage.vue'

vi.mock('../composables/useCollector', () => ({
  useCollectorDashboard: () => ({
    data: {
      value: {
        todayCollections: 'GBP 0.00',
        receiptsIssued: '0',
        assignedEvents: '2',
      },
    },
  }),
}))

describe('CollectorDashboardPage', () => {
  it('renders collector dashboard metrics', () => {
    const wrapper = mount(CollectorDashboardPage)

    expect(wrapper.text()).toContain("Today's collections")
    expect(wrapper.text()).toContain('Assigned events')
  })
})
