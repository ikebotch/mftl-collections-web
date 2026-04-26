import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import EventDetailPage from './EventDetailPage.vue'

// Mocking useRoute and useRouter
const mockPush = vi.fn()
const mockReplace = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
      replace: mockReplace
    }),
    useRoute: () => ({
      params: { id: 'event-123' },
      query: {}
    })
  }
})

// Mocking useEvent and useUpdateEvent
vi.mock('../composables/useEvents', () => ({
  useEvent: () => ({
    isLoading: { value: false },
    isError: { value: false },
    error: { value: null },
    data: {
      value: {
        id: 'event-123',
        title: 'Live Verification Event',
        description: 'Test description',
        slug: 'test-event',
        eventDate: '2026-05-01',
        status: 'active',
        isActive: true,
        displayImageUrl: 'https://test.com/image.jpg',
        receiptLogoUrl: 'https://test.com/logo.jpg',
        createdAt: '2026-04-20',
        modifiedAt: '2026-04-25'
      },
    },
    refetch: vi.fn()
  }),
  useUpdateEvent: () => ({
    mutateAsync: vi.fn(),
    isPending: { value: false }
  })
}))

describe('EventDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders event details and does not show Edit button in header', () => {
    const wrapper = mount(EventDetailPage, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterLink: true,
          AdminPageHeader: true,
          DetailTabs: true,
          EventRecipientFundsList: true,
          AuditTimeline: true,
          StatusBadge: true
        },
      },
    })

    expect(wrapper.text()).toContain('Live Verification Event')
    // Should not have the "Edit" button in the header
    expect(wrapper.find('button').text()).not.toBe('Edit')
    expect(wrapper.text()).toContain('Edit')
  })

  it('activates inline edit mode when Edit Details is clicked', async () => {
    const wrapper = mount(EventDetailPage, {
      global: {
        plugins: [createPinia()],
        stubs: {
          AdminPageHeader: true,
          DetailTabs: true,
          EventRecipientFundsList: true,
          AuditTimeline: true,
          StatusBadge: true
        },
      },
    })

    const editBtn = wrapper.findAll('button').find(b => b.text().includes('Edit'))
    expect(editBtn).toBeDefined()
    
    await editBtn?.trigger('click')
    
    // Now should show "Cancel" and "Save Changes"
    expect(wrapper.text()).toContain('Save Changes')
    expect(wrapper.text()).toContain('Cancel')
  })
})
