import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTenantStore = defineStore('tenant', () => {
  const currentTenantId = ref<string | null>(localStorage.getItem('mftl_tenant_id'))
  const currentTenantName = ref<string | null>(localStorage.getItem('mftl_tenant_name'))

  const hasTenant = computed(() => !!currentTenantId.value)

  function setTenant(id: string, name: string) {
    currentTenantId.value = id
    currentTenantName.value = name
    localStorage.setItem('mftl_tenant_id', id)
    localStorage.setItem('mftl_tenant_name', name)
  }

  function clearTenant() {
    currentTenantId.value = null
    currentTenantName.value = null
    localStorage.removeItem('mftl_tenant_id')
    localStorage.removeItem('mftl_tenant_name')
  }

  return {
    currentTenantId,
    currentTenantName,
    hasTenant,
    setTenant,
    clearTenant
  }
})
