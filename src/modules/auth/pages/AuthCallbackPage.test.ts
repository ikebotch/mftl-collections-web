import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthCallbackPage from './AuthCallbackPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { usersService } from '@/modules/users/services/usersService'

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    handleRedirectCallback: vi.fn(async () => ({ appState: {} })),
    isAuthenticated: { value: true },
    isLoading: { value: false },
    user: { value: { sub: 'auth0|1' } }
  })
}))

vi.mock('@/modules/users/services/usersService', () => ({
  usersService: {
    getMe: vi.fn()
  }
}))

describe('AuthCallbackPage', () => {
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/admin', name: 'admin-dashboard', component: { template: '<div>Admin</div>' } },
        { path: '/collector', name: 'collector-dashboard', component: { template: '<div>Collector</div>' } },
        { path: '/access-pending', name: 'access-pending', component: { template: '<div>Pending</div>' } },
        { path: '/access-suspended', name: 'access-suspended', component: { template: '<div>Suspended</div>' } },
        { path: '/auth/callback', component: AuthCallbackPage }
      ]
    })
  })

  it('routes to admin when user has admin roles', async () => {
    vi.mocked(usersService.getMe).mockResolvedValue({
      id: '1',
      name: 'Admin User',
      email: 'admin@test.com',
      accessState: 'active',
      effectiveRoles: ['Organisation Admin'],
      auth0Roles: [],
      scopeAssignments: [],
      isPlatformAdmin: false,
      role: 'Admin',
      status: 'Active',
      inviteStatus: 'Accepted',
      auth0Id: 'auth0|1',
      createdAt: '',
      permissions: []
    })

    mount(AuthCallbackPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for syncAndNavigate
    await vi.waitFor(() => {
      expect(router.currentRoute.value.path).toBe('/admin')
    })
  })

  it('routes to collector when user has only collector roles', async () => {
    vi.mocked(usersService.getMe).mockResolvedValue({
      id: '2',
      name: 'Collector User',
      email: 'collector@test.com',
      accessState: 'active',
      effectiveRoles: ['Collector'],
      auth0Roles: [],
      scopeAssignments: [],
      isPlatformAdmin: false,
      role: 'Collector',
      status: 'Active',
      inviteStatus: 'Accepted',
      auth0Id: 'auth0|2',
      createdAt: '',
      permissions: []
    })

    mount(AuthCallbackPage, {
      global: {
        plugins: [router]
      }
    })

    await vi.waitFor(() => {
      expect(router.currentRoute.value.path).toBe('/collector')
    })
  })

  it('routes to access-pending when accessState is pending-access', async () => {
    vi.mocked(usersService.getMe).mockResolvedValue({
      id: '3',
      name: 'New User',
      email: 'new@test.com',
      accessState: 'pending-access',
      effectiveRoles: [],
      auth0Roles: [],
      scopeAssignments: [],
      isPlatformAdmin: false,
      role: 'User',
      status: 'Active',
      inviteStatus: 'Accepted',
      auth0Id: 'auth0|3',
      createdAt: '',
      permissions: []
    })

    mount(AuthCallbackPage, {
      global: {
        plugins: [router]
      }
    })

    await vi.waitFor(() => {
      expect(router.currentRoute.value.path).toBe('/pending-access')
    })
  })
})
