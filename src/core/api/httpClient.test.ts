import { describe, expect, it, vi, beforeEach } from 'vitest'
import { HttpClient } from './httpClient'
import axios from 'axios'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn().mockReturnValue({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
        request: vi.fn(),
      }),
    },
  }
})

function createStorageMock() {
  const store = new Map<string, string>()

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  }
}

describe('HttpClient', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    Object.defineProperty(window, 'localStorage', {
      value: createStorageMock(),
      configurable: true,
    })
  })

  it('attaches tenant header when tenant is selected', async () => {
    const tenantStore = useTenantStore()
    tenantStore.setTenant('test-tenant-id', 'Test Tenant')
    
    new HttpClient()
    // Get the request interceptor
    const interceptor = (vi.mocked(axios.create().interceptors.request.use) as any).mock.calls[0][0]
    
    const config = { headers: {} }
    const result = await interceptor(config)
    
    expect(result.headers['X-Tenant-Id']).toBe('test-tenant-id')
  })

  it('attaches correlation ID to every request', async () => {
    new HttpClient()
    const interceptor = (vi.mocked(axios.create().interceptors.request.use) as any).mock.calls[0][0]
    
    const config = { headers: {} }
    const result = await interceptor(config)
    
    expect(result.headers['x-correlation-id']).toBeDefined()
    expect(typeof result.headers['x-correlation-id']).toBe('string')
  })

  it('enforces single tenant ID even if multiple are somehow selected', async () => {
    const tenantStore = useTenantStore()
    // Force multiple IDs to test the safeguard in HttpClient
    tenantStore.selectedTenantIds = ['id-1', 'id-2']
    
    new HttpClient()
    const interceptor = (vi.mocked(axios.create().interceptors.request.use) as any).mock.calls[0][0]
    
    const config = { headers: {} }
    const result = await interceptor(config)
    
    // Should only take the first one and never contain a comma
    expect(result.headers['X-Tenant-Id']).not.toContain(',')
    expect(result.headers['X-Tenant-Id']).toBe('id-1')
  })
})
