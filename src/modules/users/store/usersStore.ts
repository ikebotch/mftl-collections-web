import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserDetail } from '../services/usersService'
import { usersService } from '../services/usersService'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'

export const useUsersStore = defineStore('users-module', () => {
  const me = ref<UserDetail | null>(null)
  
  const isAuthenticated = computed(() => !!me.value)
  const isPlatformAdmin = computed(() => me.value?.isPlatformAdmin ?? false)
  const accessState = computed(() => me.value?.accessState ?? 'pending-access')
  
  const roles = computed(() => me.value?.effectiveRoles ?? [])
  const scopes = computed(() => me.value?.scopeAssignments ?? [])
  const permissions = computed(() => me.value?.permissions ?? [])
  
  function hasPermission(permission: string) {
    if (isPlatformAdmin.value) return true
    if (permissions.value.includes('*')) return true
    if (permissions.value.includes(permission)) return true
    
    const parts = permission.split('.')
    if (parts.length > 0 && permissions.value.includes(`${parts[0]}.*`)) return true
    
    return false
  }

  function setMe(profile: UserDetail | null) {
    me.value = profile
  }

  async function fetchMe(force = false) {
    if (me.value && !force) return me.value
    const profile = await usersService.getMe()
    me.value = profile

    // Auto-bootstrap tenant if the backend successfully bootstrapped one
    if (profile.activeTenantId) {
      const tenantStore = useTenantStore()
      if (!tenantStore.selectedTenantId) {
        // Find the target name for the resolved tenant
        const assignment = profile.scopeAssignments.find(a => a.targetId === profile.activeTenantId)
        tenantStore.setTenant(profile.activeTenantId, assignment?.targetName || 'Default Tenant')
      }
    }
    
    return profile
  }

  function clear() {
    me.value = null
  }

  return {
    me,
    isAuthenticated,
    isPlatformAdmin,
    accessState,
    roles,
    scopes,
    permissions,
    hasPermission,
    setMe,
    fetchMe,
    clear
  }
})
