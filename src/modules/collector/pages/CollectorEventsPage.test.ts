import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it, vi } from 'vitest'
import CollectorEventsPage from './CollectorEventsPage.vue'

const assignmentsState = {
  isLoading: { value: false },
  isError: { value: false },
  error: { value: null },
  refetch: vi.fn(),
  data: {
    value: {
      hasAssignments: true,
      blockedReason: '',
      events: [
        {
          id: 'event-1',
          title: 'Youth Conference 2026',
          description: 'Assigned event',
          status: 'Live',
          eventDate: '2026-05-10T00:00:00Z',
          dateLabel: '10 May 2026',
          location: 'Main Site',
          assignedFundCount: 1,
        },
      ],
      funds: [
        {
          id: 'fund-1',
          eventId: 'event-1',
          name: 'Youth Scholarships',
          description: 'Assigned fund',
          targetAmount: 5000,
          collectedAmount: 2450,
          currency: 'GHS',
          progress: 49,
        },
      ],
    },
  },
}

vi.mock('../composables/useCollector', () => ({
  useCollectorAssignments: () => assignmentsState,
}))

describe('CollectorEventsPage', () => {
  it('renders assigned events and funds tabs from collector-scoped data', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/collector/events', component: CollectorEventsPage },
        { path: '/collector/contributions/new', component: { template: '<div />' } },
      ],
    })

    await router.push('/collector/events')

    const wrapper = mount(CollectorEventsPage, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Youth Conference 2026')
    expect(wrapper.text()).toContain('Assigned Shifts')
    expect(wrapper.text()).toContain('funds')
  })
})
