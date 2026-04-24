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

function mountPage(path = '/collector/contributions/new') {
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
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })

  return { wrapper, router, path }
}

describe('CollectorContributionCreatePage', () => {
  it('preselects event from the query string', async () => {
    const { wrapper, router, path } = mountPage()
    await router.push(`${path}?eventId=event-1`)
    await flushPromises()

    expect((wrapper.find('#collector-event').element as HTMLSelectElement).value).toBe('event-1')
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
    }

    const { wrapper, router, path } = mountPage()
    await router.push(`${path}?eventId=event-2`)
    await flushPromises()

    expect(wrapper.text()).toContain('No recipient funds found for this event')
  })

  it('submits the full collector cash payload and navigates to the receipt', async () => {
    recordCash.mockResolvedValue({
      contributionId: 'contribution-1',
      receiptId: 'receipt-1',
      status: 'Completed',
    })

    const { wrapper, router, path } = mountPage()
    await router.push(`${path}?eventId=event-1`)
    await flushPromises()

    await wrapper.find('#collector-fund').setValue('fund-1')
    await wrapper.find('#collector-name').setValue('Ama Serwaa')
    await wrapper.find('#collector-phone').setValue('+233241234567')
    await wrapper.find('#collector-email').setValue('ama@example.com')
    await wrapper.find('#collector-amount').setValue('150')
    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(recordCash).toHaveBeenCalledWith(
      {
        eventId: 'event-1',
        recipientFundId: 'fund-1',
        amount: 150,
        currency: 'GHS',
        contributorName: 'Ama Serwaa',
        contributorPhone: '+233241234567',
        contributorEmail: 'ama@example.com',
        anonymous: false,
        paymentMethod: 'cash',
        note: '',
      },
      {
        headers: {
          'X-Dev-User-Id': 'dev-collector',
        },
      },
    )
    expect(router.currentRoute.value.fullPath).toBe('/collector/receipts/receipt-1')
  })
})
