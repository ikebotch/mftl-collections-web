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

export function readSelectedTenantId(): string {
  return readStorage(TENANT_ID_KEY)
}

export const useTenantStore = defineStore('tenant', () => {
  const selectedTenantId = ref(readSelectedTenantId())
  const selectedTenantName = ref(readStorage(TENANT_NAME_KEY))

  const hasTenant = computed(() => Boolean(selectedTenantId.value))

  function setTenant(id: string, name: string) {
    selectedTenantId.value = id
    selectedTenantName.value = name
    getStorage()?.setItem(TENANT_ID_KEY, id)
    getStorage()?.setItem(TENANT_NAME_KEY, name)
  }

  function clearTenant() {
    selectedTenantId.value = ''
    selectedTenantName.value = ''
    getStorage()?.removeItem(TENANT_ID_KEY)
    getStorage()?.removeItem(TENANT_NAME_KEY)
  }

  return {
    selectedTenantId,
    selectedTenantName,
    hasTenant,
    setTenant,
    clearTenant,
  }
})
