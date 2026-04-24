import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import EventListPage from './EventListPage.vue'

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')

  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
    }),
  }
})

vi.mock('../composables/useEvents', () => ({
  useEvents: () => ({
    isLoading: { value: false },
    isError: { value: false },
    error: { value: null },
    data: {
      value: [
        {
          id: 'event-1',
          title: 'Community fundraiser',
          eventDate: '2026-04-24',
          status: 'active',
          eventType: 'community',
          currency: 'GBP',
        },
      ],
    },
  }),
}))

describe('EventListPage', () => {
  it('renders event rows', () => {
    const wrapper = mount(EventListPage, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Community fundraiser')
  })
})
