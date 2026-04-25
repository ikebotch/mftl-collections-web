import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it, vi } from 'vitest'
import CollectorContributionCreatePage from './CollectorContributionCreatePage.vue'

const { assignmentsState, recordCash } = vi.hoisted(() => ({
  assignmentsState: {
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
            description: 'Fund description',
            targetAmount: 5000,
            collectedAmount: 2450,
            currency: 'GHS',
            progress: 49,
          },
        ],
      },
    },
    isLoading: { value: false },
    isError: { value: false },
    error: { value: null },
    refetch: vi.fn(),
  },
  recordCash: vi.fn(),
}))

vi.mock('../composables/useCollector', () => ({
  useCollectorAssignments: () => assignmentsState,
}))

vi.mock('@/modules/contributions/services/contributionsService', () => ({
  contributionsService: {
    recordCash,
  },
}))

function mountPage() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/collector/contributions/new', component: CollectorContributionCreatePage },
      { path: '/collector/receipts/:id', component: { template: '<div />' } },
    ],
  })

  const wrapper = mount(CollectorContributionCreatePage, {
    global: {
      plugins: [router],
    },
  })

  return { wrapper, router }
}

describe('CollectorContributionCreatePage', () => {
  it('preselects event from the query string', async () => {
    const { wrapper, router } = mountPage()
    await router.push('/collector/contributions/new?eventId=event-1')
    await flushPromises()

    // Should show the selected event title in the summary
    expect(wrapper.text()).toContain('Youth Conference 2026')
    // Should show fund selection step
    expect(wrapper.text()).toContain('Selected Fund')
  })

  it('shows empty fund state when selected event has no assigned funds', async () => {
    assignmentsState.data.value = {
      ...assignmentsState.data.value,
      events: [
        ...assignmentsState.data.value.events,
        {
          id: 'event-2',
          title: 'Community Outreach',
          description: 'Second event',
          status: 'Live',
          eventDate: '2026-06-01T00:00:00Z',
          dateLabel: '01 Jun 2026',
          location: 'Town Hall',
          assignedFundCount: 0,
        },
      ],
      // No funds for event-2
    }

    const { wrapper, router } = mountPage()
    await router.push('/collector/contributions/new?eventId=event-2')
    await flushPromises()

    expect(wrapper.text()).toContain('No recipient funds found for this event')
  })

  it('submits the full collector cash payload and navigates to the receipt', async () => {
    recordCash.mockResolvedValue({
      contributionId: 'contribution-1',
      receiptId: 'receipt-1',
      status: 'Completed',
    })

    const { wrapper, router } = mountPage()
    // Start with event selected
    await router.push('/collector/contributions/new?eventId=event-1')
    await flushPromises()

    // 1. Select Fund
    const fundBtn = wrapper.findAll('button').find(b => b.text().includes('Youth Scholarships'))
    await fundBtn?.trigger('click')
    await flushPromises()

    // 2. Fill Details (inputs should now be visible)
    const nameInput = wrapper.find('input[placeholder="Ama Serwaa"]')
    const phoneInput = wrapper.find('input[placeholder="+233 24 123 4567"]')
    const amountInput = wrapper.find('input[placeholder="0.00"]')
    
    await nameInput.setValue('Ama Serwaa')
    await phoneInput.setValue('+233241234567')
    await amountInput.setValue('150')
    await flushPromises()

    // 3. Submit
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('Next: Payment'))
    await submitBtn?.trigger('click')
    await flushPromises()

    expect(recordCash).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'event-1',
        recipientFundId: 'fund-1',
        amount: 150,
        contributorName: 'Ama Serwaa',
        contributorPhone: '+233241234567',
      }),
      expect.anything()
    )
    expect(router.currentRoute.value.path).toBe('/collector/receipts/receipt-1')
  })
})
