<template>
  <div v-if="isDev" class="fixed top-20 right-4 z-[100] max-w-xs bg-black/90 border border-violet-500/50 p-4 font-mono text-[10px] text-violet-400 shadow-2xl backdrop-blur-xl">
    <div class="flex items-center justify-between mb-3 border-b border-violet-500/30 pb-2">
      <span class="font-black uppercase tracking-widest text-white">System Diagnostics</span>
      <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
    </div>
    
    <div class="space-y-2">
      <div class="flex justify-between gap-4">
        <span class="text-slate-500">Tenant ID:</span>
        <span class="text-white truncate">{{ tenantStore.selectedTenantId || 'NONE' }}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-slate-500">Roles:</span>
        <span class="text-emerald-400 truncate">{{ roles.join(', ') || 'NONE' }}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-slate-500">Assignments:</span>
        <span class="text-white">{{ assignmentCount }}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-slate-500">Events:</span>
        <span class="text-white">{{ eventCount }}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span class="text-slate-500">Funds:</span>
        <span class="text-white">{{ fundCount }}</span>
      </div>
      <div class="flex justify-between gap-4 border-t border-white/5 pt-2 mt-2">
        <span class="text-slate-500">API Latency:</span>
        <span class="text-white">Active</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useUsersStore } from '@/modules/users/store/usersStore'
import { useCollectorDashboard } from '../composables/useCollector'

const isDev = import.meta.env.DEV

const tenantStore = useTenantStore()
const usersStore = useUsersStore()
const dashboardQuery = useCollectorDashboard()

const roles = computed(() => usersStore.roles)
const assignmentCount = computed(() => dashboardQuery.data.value?.profile.assignedEventCount || 0)
const eventCount = computed(() => dashboardQuery.data.value?.assignments.events.length || 0)
const fundCount = computed(() => dashboardQuery.data.value?.assignments.funds.length || 0)
</script>
