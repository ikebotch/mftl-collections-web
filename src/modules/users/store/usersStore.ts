import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserDetail, ScopeAssignment } from '../services/usersService'
import { usersService } from '../services/usersService'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useBranchStore } from '@/modules/branches/store/branchStore'
import { queryClient } from '@/core/api/queryClient'

const LAST_USER_ID_KEY = 'mftl.lastUserId'

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

  function clearAllSessionState() {
    const tenantStore = useTenantStore()
    const branchStore = useBranchStore()
    
    tenantStore.clearTenant()
    branchStore.clearBranch()
    
    // Clear tenant-scoped queries
    const keysToClear = [
      'dashboard', 'contributions', 'branches', 'events', 
      'recipientFunds', 'collectors', 'donors', 'payments', 
      'reports', 'users', 'collector', 'tenants-list'
    ]
    
    keysToClear.forEach(key => {
      queryClient.removeQueries({ queryKey: [key] })
    })
  }

  function setMe(profile: UserDetail | null) {
    me.value = profile
  }

  async function fetchMe(force = false) {
    if (me.value && !force) return me.value
    const profile = await usersService.getMe()
    
    // 1. Detect User Change
    const storedLastUserId = localStorage.getItem(LAST_USER_ID_KEY)
    if (storedLastUserId && storedLastUserId !== profile.auth0Id) {
      console.warn('[AUTH] User identity changed. Clearing stale session state.')
      clearAllSessionState()
    }
    localStorage.setItem(LAST_USER_ID_KEY, profile.auth0Id)

    // 2. Validate selected tenant against user's scopes
    const tenantStore = useTenantStore()
    const allowedTenantIds = profile.scopeAssignments
      .filter(a => a.scopeType === 'Tenant' && a.targetId)
      .map(a => a.targetId as string)

    // Also include tenants from branch/event scopes if they aren't explicitly assigned at tenant level
    // (The backend usually includes them in scopeAssignments if correctly implemented, but we can be defensive)
    
    const currentTenantId = tenantStore.selectedTenantId
    const isTenantValid = profile.isPlatformAdmin || (currentTenantId && allowedTenantIds.includes(currentTenantId))

    if (!isTenantValid && currentTenantId) {
      console.warn('[AUTH] Persisted tenant is no longer valid for the current user. Clearing.')
      tenantStore.clearTenant()
    }

    me.value = profile

    // 3. Auto-bootstrap tenant if none selected
    if (!tenantStore.selectedTenantId && !profile.isPlatformAdmin) {
      if (allowedTenantIds.length === 1) {
        const tId = allowedTenantIds[0]
        const assignment = profile.scopeAssignments.find(a => a.targetId === tId)
        console.info(`[AUTH] Auto-selecting single available tenant: ${assignment?.targetName}`)
        tenantStore.setTenant(tId, assignment?.targetName || 'Default Tenant')
        
        // Re-fetch to get correct effectiveRoles/permissions for this tenant
        me.value = await usersService.getMe()
        return me.value
      }
    }

    return profile
  }

  function clear() {
    me.value = null
    localStorage.removeItem(LAST_USER_ID_KEY)
    clearAllSessionState()
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
    clear,
    clearAllSessionState
  }
})
