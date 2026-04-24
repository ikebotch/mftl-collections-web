<template>
  <div class="px-6 pb-6">
    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">
      Organization
    </label>
    <div class="relative group">
      <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
        <Building2 class="w-4 h-4" />
      </div>
      
      <select
        v-model="selectedId"
        class="w-full bg-[#1e293b] border border-slate-800 text-slate-300 text-[11px] font-black uppercase tracking-widest rounded-xl py-3.5 pl-11 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all cursor-pointer hover:bg-slate-800 shadow-xl"
        @change="handleTenantChange"
      >
        <option
          v-for="tenant in tenants"
          :key="tenant.id"
          :value="tenant.id"
        >
          {{ tenant.name }}
        </option>
        <option
          v-if="showCustomInput"
          value="custom"
        >
          -- Use Custom ID --
        </option>
      </select>
      
      <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
        <ChevronDown class="w-3 h-3" />
      </div>
    </div>

    <!-- Custom ID Input (Dev Only) -->
    <div
      v-if="isCustom"
      class="mt-3 flex gap-2"
    >
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
          <Edit2 class="w-3 h-3" />
        </div>
        <input
          v-model="customId"
          type="text"
          placeholder="Enter UUID..."
          class="w-full bg-[#1e293b] border border-slate-800 text-slate-300 text-[10px] font-mono rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-violet-500 transition-all"
          @keyup.enter="applyCustomId"
        >
      </div>
      <button 
        class="bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700 transition-colors"
        @click="applyCustomId"
      >
        <Edit2 class="w-3 h-3" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Building2, ChevronDown, Edit2 } from 'lucide-vue-next'
import { useTenantStore } from '../store/tenantStore'
import { appConfig } from '@/core/config/appConfig'

const tenantStore = useTenantStore()

// Mock data - in a real app, this would come from an API
const tenants = [
  { id: '00000000-0000-0000-0000-000000000000', name: 'MFTL General' },
  { id: '11111111-1111-1111-1111-111111111111', name: 'Youth Conference' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Accra Central Mission' },
]

const selectedId = ref(tenantStore.selectedTenantId || tenants[0].id)
const isCustom = ref(!tenants.some(t => t.id === selectedId.value) && !!selectedId.value)
const customId = ref(isCustom.value ? selectedId.value : '')

const showCustomInput = computed(() => appConfig.auth.devBypass)

function handleTenantChange() {
  if (selectedId.value === 'custom') {
    isCustom.value = true
    return
  }
  
  isCustom.value = false
  const tenant = tenants.find(t => t.id === selectedId.value)
  if (tenant) {
    tenantStore.setTenant(tenant.id, tenant.name)
    window.location.reload()
  }
}

function applyCustomId() {
  if (customId.value) {
    tenantStore.setTenant(customId.value, 'Custom Org')
    window.location.reload()
  }
}

onMounted(() => {
  if (!tenantStore.selectedTenantId) {
    tenantStore.setTenant(tenants[0].id, tenants[0].name)
  }
})
</script>
