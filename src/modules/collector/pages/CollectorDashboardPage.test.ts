import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CollectorDashboardPage from './CollectorDashboardPage.vue'

vi.mock('../composables/useCollector', () => ({
  useCollectorMe: () => ({
    isLoading: { value: false },
    data: {
      value: {
        name: 'Isaac Collector',
        totalCollectedToday: 0,
        receiptsIssuedToday: 0,
        assignedEventCount: 2,
      },
    },
  }),
}))

describe('CollectorDashboardPage', () => {
  it('renders collector dashboard metrics', () => {
    const wrapper = mount(CollectorDashboardPage)

    expect(wrapper.text()).toContain("Today's Total")
    expect(wrapper.text()).toContain('Assignments')
  })
})
