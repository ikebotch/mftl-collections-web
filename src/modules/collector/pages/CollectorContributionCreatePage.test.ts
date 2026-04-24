import { flushPromises, mount } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createRouter, createMemoryHistory } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CollectorContributionCreatePage from './CollectorContributionCreatePage.vue'

const { assignedEventsState, listByEvent, recordCash } = vi.hoisted(() => ({
  assignedEventsState: {
    data: { value: [
      {
        id: 'event-1',
        title: 'Community Fundraiser',
        description: 'Fundraising event',
        eventDate: '24 Apr 2026',
        status: 'active',
      },
    ] },
    isLoading: { value: false },
    isError: { value: false },
    error: { value: null },
    refetch: vi.fn(),
  },
  listByEvent: vi.fn(async (eventId: string) =>
    eventId === 'event-empty'
      ? []
      : [
          {
            id: 'fund-1',
            eventId,
            name: 'Medical Fund',
            description: 'Medical support',
            targetAmount: 1000,
            receivedAmount: 0,
            currency: 'GBP',
          },
        ],
  ),
  recordCash: vi.fn(),
}))

vi.mock('../composables/useCollector', () => ({
  useAssignedEvents: () => assignedEventsState,
}))

vi.mock('@/modules/recipient-funds/services/recipientFundsService', () => ({
  recipientFundsService: {
    listByEvent,
  },
}))

vi.mock('@/modules/contributions/services/contributionsService', () => ({
  contributionsService: {
    recordCash,
  },
}))

function mountPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/collector/contributions/new', component: CollectorContributionCreatePage },
      { path: '/collector/receipts/:id', component: { template: '<div>Receipt page</div>' } },
      { path: '/admin/events/:id/recipient-funds/new', component: { template: '<div>Admin fund</div>' } },
      { path: '/admin/events/new', component: { template: '<div>Admin events</div>' } },
    ],
  })

  const wrapper = mount(CollectorContributionCreatePage, {
    global: {
      plugins: [router, [VueQueryPlugin, { queryClient }]],
    },
  })

  return { wrapper, router }
}

describe('CollectorContributionCreatePage', () => {
  beforeEach(() => {
    listByEvent.mockClear()
    recordCash.mockReset()
    assignedEventsState.isLoading.value = false
    assignedEventsState.isError.value = false
    assignedEventsState.error.value = null
    assignedEventsState.data.value = [
      {
        id: 'event-1',
        title: 'Community Fundraiser',
        description: 'Fundraising event',
        eventDate: '24 Apr 2026',
        status: 'active',
      },
    ]
  })

  it('loads the event dropdown from assigned events', async () => {
    const { wrapper } = mountPage()
    await flushPromises()

    expect(wrapper.find('#collector-event').text()).toContain('Community Fundraiser')
  })

  it('fetches recipient funds after selecting an event', async () => {
    const { wrapper } = mountPage()
    await flushPromises()

    await wrapper.find('#collector-event').setValue('event-1')
    await flushPromises()

    expect(listByEvent).toHaveBeenCalledWith('event-1')
    expect(wrapper.find('#collector-fund').text()).toContain('Medical Fund')
  })

  it('shows the empty fund state when no recipient funds exist', async () => {
    assignedEventsState.data.value = [
      {
        id: 'event-empty',
        title: 'Empty Event',
        description: 'No funds yet',
        eventDate: '24 Apr 2026',
        status: 'active',
      },
    ]

    const { wrapper } = mountPage()
    await flushPromises()
    await wrapper.find('#collector-event').setValue('event-empty')
    await flushPromises()

    expect(wrapper.text()).toContain('No recipient funds found for this event')
  })

  it('keeps submit disabled until the form is valid', async () => {
    const { wrapper } = mountPage()
    await flushPromises()

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeDefined()

    await wrapper.find('#collector-event').setValue('event-1')
    await flushPromises()
    await wrapper.find('#collector-fund').setValue('fund-1')
    await wrapper.find('#collector-name').setValue('Collector Donor')
    await wrapper.find('#collector-phone').setValue('012345678')
    await wrapper.find('#collector-amount').setValue('150')
    await flushPromises()

    expect(submitButton.attributes('disabled')).toBeUndefined()
  })

  it('navigates to the receipt page after a successful submit', async () => {
    recordCash.mockResolvedValue({
      contributionId: 'contribution-1',
      receiptId: 'receipt-1',
      status: 'Completed',
    })

    const { wrapper, router } = mountPage()
    await router.push('/collector/contributions/new')
    await flushPromises()

    await wrapper.find('#collector-event').setValue('event-1')
    await flushPromises()
    await wrapper.find('#collector-fund').setValue('fund-1')
    await wrapper.find('#collector-name').setValue('Collector Donor')
    await wrapper.find('#collector-phone').setValue('012345678')
    await wrapper.find('#collector-amount').setValue('150')
    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(recordCash).toHaveBeenCalledWith({
      eventId: 'event-1',
      recipientFundId: 'fund-1',
      amount: 150,
      contributorName: 'Collector Donor',
      note: '',
    })
    expect(router.currentRoute.value.fullPath).toBe('/collector/receipts/receipt-1')
  })
})
