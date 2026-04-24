import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { httpClient } from './httpClient'

vi.mock('@/core/auth/auth0', () => ({
  getAccessToken: vi.fn(async () => 'token-123'),
}))

describe('httpClient', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  it('attaches the configured tenant header and bearer token', async () => {
    window.localStorage.setItem('mftl.selectedTenantId', 'tenant-1')

    const config = await httpClient.client.interceptors.request.handlers[0].fulfilled?.({
      headers: {},
    })

    expect(config?.headers['X-Tenant-Id']).toBe('tenant-1')
    expect(config?.headers.Authorization).toBe('Bearer token-123')
  })
})
