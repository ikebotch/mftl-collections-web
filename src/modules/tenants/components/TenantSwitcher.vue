<template>
  <div class="relative group">
    <!-- Main Selector Button -->
    <button 
      class="flex items-center gap-3 w-full text-left p-1 rounded-xl hover:bg-white/5 transition-all duration-300 group/btn"
      @click="isOpen = !isOpen"
    >
      <div class="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20 rotate-2 shrink-0 group-hover/btn:rotate-0 transition-transform duration-500">
        <Building2
          v-if="!branchStore.selectedBranchId"
          class="text-white w-5 h-5"
        />
        <MapPin
          v-else
          class="text-white w-5 h-5"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-[15px] font-black font-display tracking-tight leading-none text-white truncate uppercase">
          {{ branchStore.selectedBranchName || tenantStore.selectedTenantName || 'Select Hub' }}
        </h1>
        <p class="text-[9px] uppercase tracking-[0.2em] text-slate-500 mt-1.5 font-black truncate italic">
          {{ branchStore.selectedBranchId ? 'Operational Branch' : 'Organization Hub' }}
        </p>
      </div>
      <ChevronDown class="w-3.5 h-3.5 text-slate-600 group-hover/btn:text-violet-400 transition-colors" />
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen"
      class="absolute top-full left-0 w-80 mt-4 bg-[#0a0f18] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 rounded-none"
    >
      <!-- Mode Tabs -->
      <div class="flex border-b border-slate-800 bg-slate-900/20">
        <button 
          class="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all"
          :class="activeView === 'tenants' ? 'text-white border-b-2 border-violet-500 bg-violet-500/5' : 'text-slate-500 hover:text-slate-300'"
          @click="activeView = 'tenants'"
        >
          Organizations
        </button>
        <button 
          class="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all"
          :class="activeView === 'branches' ? 'text-white border-b-2 border-violet-500 bg-violet-500/5' : 'text-slate-500 hover:text-slate-300'"
          @click="activeView = 'branches'"
        >
          Branches
        </button>
      </div>

      <!-- Content Area -->
      <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
        <!-- Tenants List -->
        <div
          v-if="activeView === 'tenants'"
          class="p-2 space-y-1"
        >
          <div
            v-if="!tenants?.length"
            class="p-8 text-center"
          >
            <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              No organizations found
            </p>
          </div>
          <button
            v-for="tenant in tenants"
            :key="tenant.id"
            class="w-full flex items-center gap-4 px-5 py-4 text-left transition-all hover:bg-white/5 border-l-2 border-transparent"
            :class="tenantStore.selectedTenantId === tenant.id ? 'bg-violet-600/10 border-violet-500 text-white' : 'text-slate-400 hover:text-slate-200'"
            @click="selectTenant(tenant)"
          >
            <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
              <Building2 class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-black uppercase tracking-tight truncate">
                {{ tenant.name }}
              </p>
              <p class="text-[8px] uppercase tracking-widest text-slate-600 font-bold mt-1">
                Primary Identity
              </p>
            </div>
            <div
              v-if="tenantStore.selectedTenantId === tenant.id"
              class="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
            />
          </button>
        </div>

        <!-- Branches List -->
        <div
          v-else-if="activeView === 'branches'"
          class="p-2 space-y-1"
        >
          <!-- Back to Tenant Option -->
          <button
            class="w-full flex items-center gap-4 px-5 py-4 text-left transition-all hover:bg-white/5 border-l-2 border-transparent"
            :class="!branchStore.selectedBranchId ? 'bg-violet-600/10 border-violet-500 text-white' : 'text-slate-400 hover:text-slate-200'"
            @click="selectBranch(null)"
          >
            <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
              <LayoutGrid class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-black uppercase tracking-tight truncate">
                Show All Hubs
              </p>
              <p class="text-[8px] uppercase tracking-widest text-slate-600 font-bold mt-1">
                Cross-Branch Overview
              </p>
            </div>
          </button>

          <div
            v-if="!branches?.length"
            class="p-8 text-center py-12"
          >
            <MapPin class="w-8 h-8 text-slate-800 mx-auto mb-4" />
            <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              No hubs established
            </p>
          </div>
          
          <button
            v-for="branch in branches"
            :key="branch.id"
            class="w-full flex items-center gap-4 px-5 py-4 text-left transition-all hover:bg-white/5 border-l-2 border-transparent"
            :class="branchStore.selectedBranchId === branch.id ? 'bg-violet-600/10 border-violet-500 text-white' : 'text-slate-400 hover:text-slate-200'"
            @click="selectBranch(branch)"
          >
            <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
              <MapPin class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-black uppercase tracking-tight truncate">
                {{ branch.name }}
              </p>
              <p class="text-[8px] uppercase tracking-widest text-slate-600 font-bold mt-1">
                {{ branch.location || 'Regional Hub' }}
              </p>
            </div>
            <div
              v-if="branchStore.selectedBranchId === branch.id"
              class="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
            />
          </button>
        </div>
      </div>
      
      <!-- Developer Matrix Control -->
      <div
        v-if="isDev"
        class="p-2 border-t border-slate-800 bg-slate-900/50"
      >
        <button 
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-600 hover:text-slate-300 transition-all hover:bg-white/5 group/dev"
          @click="showCustom = !showCustom"
        >
          <Settings class="w-3.5 h-3.5 group-hover/dev:rotate-90 transition-transform duration-500" />
          <span class="text-[9px] font-black uppercase tracking-widest">Dev Matrix Override</span>
        </button>
        
        <div
          v-if="showCustom"
          class="px-4 pb-4 pt-1 space-y-2 animate-in slide-in-from-bottom-2"
        >
          <input
            v-model="customId"
            type="text"
            placeholder="Identity UUID..."
            class="w-full bg-[#060b13] border border-slate-800 text-violet-400 text-[10px] font-mono rounded-none py-2.5 px-3 focus:outline-none focus:border-violet-500 transition-colors"
            @keyup.enter="applyCustomId"
          >
          <AppButton
            size="xs"
            variant="primary"
            class="w-full !rounded-none"
            @click="applyCustomId"
          >
            Force Sync
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { 
  Building2, 
  ChevronDown, 
  Settings, 
  MapPin, 
  LayoutGrid 
} from 'lucide-vue-next'
import { useTenantStore } from '../store/tenantStore'
import { useBranchStore } from '@/modules/branches/store/branchStore'
import { tenantsService } from '../services/tenantsService'
import { useBranches } from '../composables/useBranches'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { useQuery } from '@tanstack/vue-query'
import { appConfig } from '@/core/config/appConfig'

const tenantStore = useTenantStore()
const branchStore = useBranchStore()
const isOpen = ref(false)
const showCustom = ref(false)
const customId = ref('')
const activeView = ref<'tenants' | 'branches'>('tenants')
const isDev = computed(() => appConfig.auth.devBypass)

const { data: tenants } = useQuery({
  queryKey: ['tenants-list'],
  queryFn: () => tenantsService.list()
})

const { data: branches, refetch: refetchBranches } = useBranches(tenantStore.selectedTenantId || undefined)

// Auto-switch to branches view if tenant is already selected
onMounted(() => {
  if (tenantStore.selectedTenantId) {
    activeView.value = 'branches'
  }
})

watch(() => tenantStore.selectedTenantId, () => {
  refetchBranches()
})

function selectTenant(tenant: any) {
  tenantStore.setTenant(tenant.id, tenant.name)
  branchStore.clearBranch() // Clear branch when tenant changes
  activeView.value = 'branches'
}

function selectBranch(branch: any | null) {
  if (!branch) {
    branchStore.clearBranch()
  } else {
    branchStore.setBranch(branch.id, branch.name)
  }
  isOpen.value = false
  window.location.reload()
}

function applyCustomId() {
  if (customId.value) {
    tenantStore.setTenant(customId.value, 'Matrix Override')
    branchStore.clearBranch()
    window.location.reload()
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
