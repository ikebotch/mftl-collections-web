<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import { usersService } from '@/modules/users/services/usersService'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useUsersStore } from '@/modules/users/store/usersStore'

import { isAuthConfigured, shouldBypassAuth } from '@/core/auth/auth0'

const auth0 = !shouldBypassAuth() && isAuthConfigured() ? useAuth0() : null
const { 
  isAuthenticated = ref(shouldBypassAuth()), 
  isLoading = ref(false), 
  error = ref(null), 
  loginWithRedirect = () => {} 
} = auth0 || {}
const router = useRouter()
const usersStore = useUsersStore()

const isSyncing = ref(false)
const syncError = ref<string | null>(null)

async function syncAndNavigate() {
  if (isAuthenticated.value) {
    try {
      if (isSyncing.value) return
      isSyncing.value = true
      syncError.value = null
      
      // 1. Force backend provisioning and get user context
      console.log('AuthCallback: Fetching me...')
      const me = await usersService.getMe()
      console.log('AuthCallback: User fetched:', {
        id: me.id,
        email: me.email,
        isPlatformAdmin: me.isPlatformAdmin,
        accessState: me.accessState,
        roles: me.auth0Roles,
        scopesCount: me.scopeAssignments?.length
      })
      usersStore.setMe(me)
      
      // 2. Automatically select tenant if exactly one is assigned
      const tenantStore = useTenantStore()
      const tenantScopes = me.scopeAssignments?.filter(s => s.scopeType === 'Tenant') || []
      
      if (tenantScopes.length === 1 && !tenantStore.selectedTenantId) {
        console.log('AuthCallback: Auto-selecting single tenant:', tenantScopes[0].targetName)
        tenantStore.setTenant(tenantScopes[0].targetId!, tenantScopes[0].targetName!)
      }
      
      // 3. Redirect based on access state and roles
      if (me.accessState === 'suspended') {
        console.log('AuthCallback: User suspended')
        router.replace('/access-suspended')
        return
      }

      // Role-based routing
      const effectiveRoles = me.effectiveRoles || []
      
      const isAdmin = effectiveRoles.some(r => 
        ['Platform Admin', 'Tenant Admin', 'Organisation Admin', 'Branch Admin', 'Organisation Finance', 'Branch Finance', 'Organisation Reporting', 'Finance Admin', 'Event Manager', 'System Manager'].includes(r) ||
        r.includes('Admin') || r.includes('Finance') || r.includes('Reporting')
      ) || me.isPlatformAdmin
      
      const isCollector = effectiveRoles.some(r => 
        ['Collector', 'Collector Supervisor'].includes(r)
      )

      const hasAssignments = (me.scopeAssignments?.length ?? 0) > 0
      const isActive = me.accessState === 'active'

      console.log('AuthCallback: Routing logic:', { effectiveRoles, isCollector, isAdmin, isActive, hasAssignments })

      if (isAdmin) {
        console.log('AuthCallback: Redirecting to /admin')
        await router.replace('/admin')
      } else if (isCollector) {
        console.log('AuthCallback: Redirecting to /collector')
        await router.replace('/collector')
      } else if (isActive && hasAssignments) {
        console.log('AuthCallback: Active with assignments but no effective roles yet, landing on /admin to resolve')
        await router.replace('/admin')
      } else {
        console.log('AuthCallback: No effective roles or pending, redirecting to /pending-access')
        router.replace('/pending-access')
      }
    } catch (err: any) {
      console.error('AuthCallback: Failed to sync user context:', err)
      syncError.value = 'We encountered an error while preparing your workspace. Please try again.'
      isSyncing.value = false
    }
  } else if (!isLoading.value) {
    // Not authenticated and finished loading - likely after logout
    console.log('AuthCallback: Not authenticated, redirecting to login...')
    loginWithRedirect()
  } else if (error.value) {
    console.error('Auth error:', error.value)
    // If we have an error, we should show the error UI in the template
    // which is already handled by syncError/error reactive vars
  }
}

onMounted(() => {
  if (!isLoading.value) {
    syncAndNavigate()
  }
})

watch([isLoading, isAuthenticated], ([loading]) => {
  if (!loading) {
    syncAndNavigate()
  }
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-50">
    <div class="w-full max-w-md rounded-none border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-slate-950/40">
      <div
        v-if="!error && !syncError"
        class="mx-auto mb-4 h-12 w-12 animate-spin rounded-none border-4 border-slate-300/20 border-t-teal-300"
      />
      <div
        v-else
        class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-red-500/20 text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 class="text-2xl font-semibold">
        {{ error || syncError ? 'Authentication Error' : 'Preparing Workspace' }}
      </h1>
      <p class="mt-3 text-sm text-slate-300">
        {{ error ? error.message : (syncError || 'Your secure session is being prepared. We are synchronizing your workspace and permissions.') }}
      </p>

      <div
        v-if="error || syncError"
        class="mt-6"
      >
        <button 
          class="rounded-none bg-white px-6 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
          @click="router.replace('/')"
        >
          Back to Login
        </button>
      </div>
    </div>
  </main>
</template>
