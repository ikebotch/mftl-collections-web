<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import { usersService } from '@/modules/users/services/usersService'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useUsersStore } from '@/modules/users/store/usersStore'

const { isAuthenticated, isLoading, error } = useAuth0()
const router = useRouter()
const tenantStore = useTenantStore()
const usersStore = useUsersStore()

const isSyncing = ref(false)
const syncError = ref<string | null>(null)

async function syncAndNavigate() {
  if (isAuthenticated.value) {
    try {
      isSyncing.value = true
      syncError.value = null
      
      // 1. Force backend provisioning and get user context
      const me = await usersService.getMe()
      usersStore.setMe(me)
      
      // 2. Setup initial tenant/branch context if not set
      if (me.accessState === 'pending-access') {
        router.replace('/pending-access')
        return
      }

      if (me.accessState === 'suspended') {
        // We could have a suspended page, for now just show error
        syncError.value = 'Your account has been suspended. Please contact support.'
        return
      }

      // If we have tenant scopes, activate the first one if none selected
      const hasScopes = me.scopeAssignments && me.scopeAssignments.length > 0
      if (hasScopes && !tenantStore.hasTenant) {
        const tenantScope = me.scopeAssignments.find(s => s.scopeType === 'Tenant' || s.scopeType === 'Organisation')
        if (tenantScope && tenantScope.targetId) {
          tenantStore.setTenant(tenantScope.targetId, tenantScope.targetName || 'Default Organization')
        }
      }

      router.replace('/admin')
    } catch (err: any) {
      console.error('Failed to sync user context:', err)
      syncError.value = 'We encountered an error while preparing your workspace. Please try again.'
      isSyncing.value = false
    }
  } else if (error.value) {
    console.error('Auth error:', error.value)
    router.replace('/auth/login')
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
          @click="router.replace('/auth/login')"
        >
          Back to Login
        </button>
      </div>
    </div>
  </main>
</template>
