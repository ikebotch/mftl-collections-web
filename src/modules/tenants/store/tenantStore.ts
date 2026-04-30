import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const TENANT_ID_KEY = 'mftl.selectedTenantId'
const TENANT_NAME_KEY = 'mftl.selectedTenantName'

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storage = window.localStorage as Partial<Storage> | undefined
  if (!storage) {
    return null
  }

  return typeof storage.getItem === 'function' &&
    typeof storage.setItem === 'function' &&
    typeof storage.removeItem === 'function'
    ? (storage as Storage)
    : null
}

function readStorage(key: string): string {
  return getStorage()?.getItem(key) ?? ''
}

export function readSelectedTenantIds(): string[] {
  const stored = readStorage(TENANT_ID_KEY)
  if (!stored) return []
  if (stored.startsWith('[')) {
    try {
      return JSON.parse(stored)
    } catch {
      return [stored]
    }
  }
  return [stored]
}

export const useTenantStore = defineStore('tenant', () => {
  const selectedTenantIds = ref<string[]>(readSelectedTenantIds())
  
  // For legacy/single selection compatibility
  const selectedTenantId = computed(() => selectedTenantIds.value[0] ?? '')
  const selectedTenantName = ref(readStorage(TENANT_NAME_KEY))
  const hasTenant = computed(() => selectedTenantIds.value.length > 0)

  function setTenant(id: string, name: string) {
    selectedTenantIds.value = [id]
    selectedTenantName.value = name
    getStorage()?.setItem(TENANT_ID_KEY, id)
    getStorage()?.setItem(TENANT_NAME_KEY, name)
  }

  function setTenants(ids: string[], name?: string) {
    selectedTenantIds.value = ids
    getStorage()?.setItem(TENANT_ID_KEY, JSON.stringify(ids))
    
    let resolvedName = name
    if (!resolvedName) {
      if (ids.length > 1) {
        resolvedName = `${ids.length} Organizations`
      } else {
        // We don't have the name here, but we should clear it if no IDs
        resolvedName = ids.length === 0 ? '' : selectedTenantName.value
      }
    }
    
    selectedTenantName.value = resolvedName
    if (resolvedName) {
      getStorage()?.setItem(TENANT_NAME_KEY, resolvedName)
    } else {
      getStorage()?.removeItem(TENANT_NAME_KEY)
    }
  }


  function clearTenant() {
    selectedTenantIds.value = []
    selectedTenantName.value = ''
    getStorage()?.removeItem(TENANT_ID_KEY)
    getStorage()?.removeItem(TENANT_NAME_KEY)
  }

  return {
    selectedTenantIds,
    selectedTenantId,
    selectedTenantName,
    hasTenant,
    setTenant,
    setTenants,
    clearTenant,
  }
})

// Helper for HTTP client
export function readSelectedTenantId(): string {
  const ids = readSelectedTenantIds()
  return ids[0] ?? ''
}
