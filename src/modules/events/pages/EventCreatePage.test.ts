import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import EventCreatePage from './EventCreatePage.vue'

vi.mock('../composables/useEvents', () => ({
  useCreateEvent: () => ({
    isPending: { value: false },
    isError: { value: false },
    isSuccess: { value: false },
    error: { value: null },
    mutateAsync: vi.fn(async () => ({ id: 'event-1' })),
  }),
}))

vi.mock('@/modules/recipient-funds/composables/useRecipientFunds', () => ({
  useCreateRecipientFund: () => ({
    mutateAsync: vi.fn(async () => ({ id: 'fund-1' })),
    isPending: { value: false },
    isError: { value: false },
  }),
}))

describe('EventCreatePage', () => {
  it('renders the create event form', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/admin/events', component: { template: '<div />' } }],
    })

    const wrapper = mount(EventCreatePage, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    expect(wrapper.text()).toContain('New Collection Event')
    expect(wrapper.text()).toContain('Basic Details')
  })
})
