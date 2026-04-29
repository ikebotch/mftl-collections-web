import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import AdminLayout from './AdminLayout.vue'

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { name: 'Test User', email: 'test@example.com' },
    logout: vi.fn()
  }),
  createAuth0: vi.fn(() => ({
    install: vi.fn()
  }))
}))

vi.mock('@/modules/users/store/usersStore', () => ({
  useUsersStore: () => ({
    me: { name: 'Store User', email: 'store@example.com' },
    fetchMe: vi.fn()
  })
}))

describe('AdminLayout', () => {
  it('renders admin navigation links', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/admin', component: { template: '<div />' } }],
    })

    const wrapper = mount(AdminLayout, {
      global: {
        plugins: [router, createPinia()],
        stubs: {
          RouterView: true,
          TenantSwitcher: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).toContain('Events')
    expect(wrapper.text()).toContain('Contributions')
  })

  it('renders current user name and email from store', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/admin', component: { template: '<div />' } }],
    })

    const pinia = createPinia()
    
    const wrapper = mount(AdminLayout, {
      global: {
        plugins: [router, pinia],
        stubs: {
          RouterView: true,
          TenantSwitcher: true,
        },
      },
    })

    // Click dropdown to show user info
    const dropdownButton = wrapper.findAll('button').find(b => b.classes().includes('ml-2'))
    await dropdownButton?.trigger('click')

    // Wait for dropdown
    await wrapper.vm.$nextTick()

    const truncateElements = wrapper.findAll('.truncate')
    expect(truncateElements.length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Store User')
    expect(wrapper.text()).toContain('store@example.com')
  })
})
