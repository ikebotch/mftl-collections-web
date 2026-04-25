import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import AdminLayout from './AdminLayout.vue'

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    logout: vi.fn(),
    user: { value: { email: 'admin@example.com' } },
    isAuthenticated: { value: true },
    isLoading: { value: false },
  }),
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
        },
      },
    })

    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).toContain('Events')
    expect(wrapper.text()).toContain('Contributions')
  })
})
