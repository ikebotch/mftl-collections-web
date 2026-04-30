import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUsersStore } from './usersStore'
import { usersService } from '../services/usersService'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { queryClient } from '@/core/api/queryClient'

vi.mock('../services/usersService', () => ({
  usersService: {
    getMe: vi.fn(),
  },
}))

vi.mock('@/core/api/queryClient', () => ({
  queryClient: {
    removeQueries: vi.fn(),
  },
}))

function createStorageMock() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  }
}

describe('usersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    Object.defineProperty(window, 'localStorage', {
      value: createStorageMock(),
      configurable: true,
    })
  })

  it('clears session state when user identity changes', async () => {
    const usersStore = useUsersStore()
    const tenantStore = useTenantStore()
    
    // Set initial state
    window.localStorage.setItem('mftl.lastUserId', 'user-1')
    tenantStore.setTenant('tenant-1', 'OmniBSIC')
    
    // Mock getMe for a DIFFERENT user
    vi.mocked(usersService.getMe).mockResolvedValue({
      id: '2',
      auth0Id: 'user-2',
      email: 'isaac@mftl.com',
      isPlatformAdmin: false,
      scopeAssignments: [
        { scopeType: 'Tenant', targetId: 'tenant-2', targetName: 'MFTL' }
      ]
    } as any)

    await usersStore.fetchMe()

    // Verify state was cleared
    expect(tenantStore.selectedTenantId).toBe('tenant-2') // Auto-selected because it's the only one
    expect(queryClient.removeQueries).toHaveBeenCalled()
    expect(window.localStorage.getItem('mftl.lastUserId')).toBe('user-2')
  })

  it('clears invalid persisted tenant', async () => {
    const usersStore = useUsersStore()
    const tenantStore = useTenantStore()
    
    // Set initial state for SAME user
    window.localStorage.setItem('mftl.lastUserId', 'user-1')
    tenantStore.setTenant('stale-tenant', 'Old Tenant')
    
    // Mock getMe for user-1 but with different allowed tenants
    vi.mocked(usersService.getMe).mockResolvedValue({
      auth0Id: 'user-1',
      isPlatformAdmin: false,
      scopeAssignments: [
        { scopeType: 'Tenant', targetId: 'valid-tenant', targetName: 'New Tenant' },
        { scopeType: 'Tenant', targetId: 'another-tenant', targetName: 'Another' }
      ]
    } as any)

    await usersStore.fetchMe()

    // Verify stale tenant was cleared
    expect(tenantStore.selectedTenantId).toBe('')
  })

  it('auto-bootstraps single tenant for non-platform admin', async () => {
    const usersStore = useUsersStore()
    const tenantStore = useTenantStore()
    
    vi.mocked(usersService.getMe).mockResolvedValueOnce({
      auth0Id: 'user-1',
      isPlatformAdmin: false,
      scopeAssignments: [
        { scopeType: 'Tenant', targetId: 'mftl-tenant', targetName: 'MFTL' }
      ]
    } as any).mockResolvedValueOnce({
      auth0Id: 'user-1',
      isPlatformAdmin: false,
      effectiveRoles: ['Tenant Admin'],
      scopeAssignments: [
        { scopeType: 'Tenant', targetId: 'mftl-tenant', targetName: 'MFTL' }
      ]
    } as any)

    await usersStore.fetchMe()

    expect(tenantStore.selectedTenantId).toBe('mftl-tenant')
    expect(usersStore.roles).toContain('Tenant Admin')
  })
})
