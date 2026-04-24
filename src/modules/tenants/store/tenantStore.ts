import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const TENANT_ID_KEY = 'mftl.selectedTenantId'
const TENANT_NAME_KEY = 'mftl.selectedTenantName'

function readStorage(key: string): string {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(key) ?? ''
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
    window.localStorage.setItem(TENANT_ID_KEY, id)
    window.localStorage.setItem(TENANT_NAME_KEY, name)
  }

  function clearTenant() {
    selectedTenantId.value = ''
    selectedTenantName.value = ''
    window.localStorage.removeItem(TENANT_ID_KEY)
    window.localStorage.removeItem(TENANT_NAME_KEY)
  }

  return {
    selectedTenantId,
    selectedTenantName,
    hasTenant,
    setTenant,
    clearTenant,
  }
})
