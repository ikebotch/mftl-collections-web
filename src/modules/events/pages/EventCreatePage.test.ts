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

describe('EventCreatePage', () => {
  it('renders the create event form', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/admin/events/:id', component: { template: '<div />' } }],
    })

    const wrapper = mount(EventCreatePage, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    expect(wrapper.text()).toContain('Create Event')
    // Steps check
    expect(wrapper.text()).toContain('Basics')
  })
})
