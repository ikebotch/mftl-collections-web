import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTenantStore } from './tenantStore'

describe('tenantStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  it('stores the selected tenant in pinia and localStorage', () => {
    const store = useTenantStore()
    store.setTenant('tenant-1', 'Community Collections')

    expect(store.selectedTenantId).toBe('tenant-1')
    expect(window.localStorage.getItem('mftl.selectedTenantName')).toBe('Community Collections')
  })
})
