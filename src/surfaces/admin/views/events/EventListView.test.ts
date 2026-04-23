import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EventListView from './EventListView.vue'
import { createRouter, createWebHistory } from 'vue-router'

vi.mock('@tanstack/vue-query', () => ({
  useQuery: () => ({
    data: [{ id: '1', title: 'Test Event', isActive: true }],
    isLoading: false,
    isError: false
  })
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: {} }]
})

describe('EventListView', () => {
  it('renders events list', async () => {
    const wrapper = mount(EventListView, {
      global: {
        plugins: [router],
        stubs: ['PageHeader', 'AppCard', 'AppButton', 'AppTable', 'AppBadge', 'LoadingState', 'ErrorState', 'EmptyState']
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })
})
