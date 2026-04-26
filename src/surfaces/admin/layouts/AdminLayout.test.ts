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
})
