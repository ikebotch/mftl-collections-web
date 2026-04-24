import { beforeEach, describe, expect, it, vi } from 'vitest'

const useAuth0Mock = vi.fn()
const shouldBypassAuthMock = vi.fn(() => false)
const isAuthConfiguredMock = vi.fn(() => true)

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => useAuth0Mock(),
}))

vi.mock('./auth0', () => ({
  isAuthConfigured: () => isAuthConfiguredMock(),
  shouldBypassAuth: () => shouldBypassAuthMock(),
}))

import { requireAuth, requirePermission } from './authGuards'

describe('requirePermission', () => {
  beforeEach(() => {
    useAuth0Mock.mockReset()
    shouldBypassAuthMock.mockReset()
    shouldBypassAuthMock.mockReturnValue(false)
    isAuthConfiguredMock.mockReset()
    isAuthConfiguredMock.mockReturnValue(true)
  })

  it('allows navigation when the placeholder permission check passes', () => {
    const next = vi.fn()
    requirePermission('events:read')({} as never, {} as never, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('allows protected routes in dev bypass mode', () => {
    shouldBypassAuthMock.mockReturnValue(true)

    const next = vi.fn()
    requireAuth({ fullPath: '/admin/events' } as never, {} as never, next)

    expect(next).toHaveBeenCalledWith()
    expect(useAuth0Mock).not.toHaveBeenCalled()
  })

  it('does not crash when the Auth0 object is unavailable in bypass mode', () => {
    shouldBypassAuthMock.mockReturnValue(true)
    useAuth0Mock.mockImplementation(() => {
      throw new Error('Auth0 should not be touched in bypass mode')
    })

    const next = vi.fn()

    expect(() => requireAuth({ fullPath: '/collector' } as never, {} as never, next)).not.toThrow()
    expect(next).toHaveBeenCalledWith()
  })

  it('redirects to login when bypass is disabled and the user is not authenticated', async () => {
    const loginWithRedirect = vi.fn(async () => undefined)
    useAuth0Mock.mockReturnValue({
      isAuthenticated: { value: false },
      isLoading: { value: false },
      loginWithRedirect,
    })

    const next = vi.fn()
    requireAuth({ fullPath: '/admin' } as never, {} as never, next)

    expect(loginWithRedirect).toHaveBeenCalledWith({
      appState: { target: '/admin' },
    })
    expect(next).not.toHaveBeenCalled()
  })
})
