import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTenantStore } from './tenantStore'

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

describe('tenantStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    Object.defineProperty(window, 'localStorage', {
      value: createStorageMock(),
      configurable: true,
    })
  })

  it('stores the selected tenant in pinia and localStorage', () => {
    const store = useTenantStore()
    store.setTenant('tenant-1', 'Community Collections')

    expect(store.selectedTenantId).toBe('tenant-1')
    expect(window.localStorage.getItem('mftl.selectedTenantName')).toBe('Community Collections')
  })
})
