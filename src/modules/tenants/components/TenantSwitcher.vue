<template>
  <div class="relative group">
    <button 
      class="flex items-center gap-3 w-full text-left p-1 rounded-xl hover:bg-white/5 transition-all duration-300"
      @click="isOpen = !isOpen"
    >
      <div class="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20 rotate-3 shrink-0">
        <Heart class="text-white w-6 h-6 fill-current" />
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-lg font-bold font-display tracking-tight leading-none text-white truncate">
          {{ tenantStore.selectedTenantName || 'MFTL' }}
        </h1>
        <p class="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1 font-bold truncate">
          Collections
        </p>
      </div>
      <ChevronDown class="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
    </button>

    <div 
      v-if="isOpen"
      class="absolute top-full left-0 w-full mt-2 bg-[#1e293b] border border-slate-800 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div class="p-2 space-y-1">
        <button
          v-for="tenant in tenants"
          :key="tenant.id"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-white/5"
          :class="tenantStore.selectedTenantId === tenant.id ? 'bg-violet-600/20 text-violet-400' : 'text-slate-300'"
          @click="selectTenant(tenant)"
        >
          <Building2 class="w-4 h-4 shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold truncate">{{ tenant.name }}</p>
            <p class="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Organization</p>
          </div>
          <Check v-if="tenantStore.selectedTenantId === tenant.id" class="w-3 h-3" />
        </button>
      </div>
      
      <div class="p-2 border-t border-slate-800 bg-slate-900/50">
        <button 
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-slate-500 hover:text-slate-300 transition-all hover:bg-white/5"
          @click="showCustom = !showCustom"
        >
          <Settings class="w-4 h-4" />
          <span class="text-xs font-bold">Custom Tenant ID</span>
        </button>
        
        <div v-if="showCustom" class="px-4 pb-3 pt-1 space-y-2">
          <input
            v-model="customId"
            type="text"
            placeholder="Enter UUID..."
            class="w-full bg-slate-800 border border-slate-700 text-white text-[10px] font-mono rounded-lg py-2 px-3 focus:outline-none focus:border-violet-500"
            @keyup.enter="applyCustomId"
          >
          <AppButton size="xs" variant="primary" class="w-full" @click="applyCustomId">
            Switch Tenant
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Heart, ChevronDown, Building2, Check, Settings } from 'lucide-vue-next'
import { useTenantStore } from '../store/tenantStore'
import AppButton from '@/shared/components/buttons/AppButton.vue'

const tenantStore = useTenantStore()
const isOpen = ref(false)
const showCustom = ref(false)
const customId = ref('')

const tenants = [
  { id: '00000000-0000-0000-0000-000000000000', name: 'MFTL General' },
  { id: '11111111-1111-1111-1111-111111111111', name: 'Youth Conference' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Accra Central Mission' },
]

function selectTenant(tenant: any) {
  tenantStore.setTenant(tenant.id, tenant.name)
  isOpen.value = false
  window.location.reload()
}

function applyCustomId() {
  if (customId.value) {
    tenantStore.setTenant(customId.value, 'Custom Org')
    window.location.reload()
  }
}
</script>
