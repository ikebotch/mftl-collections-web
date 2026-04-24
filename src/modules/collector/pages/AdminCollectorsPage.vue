<template>
  <div class="space-y-12">
    <!-- Editorial Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-2 h-10 bg-violet-600" />
          <h1 class="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Collectors
          </h1>
        </div>
        <p class="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-5">
          Operational Intelligence & Field Management
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <AppButton
          variant="outline"
          class="!rounded-2xl !py-6 !px-8 border-2 border-slate-200 hover:border-slate-900 transition-all"
        >
          <Download class="w-4 h-4 mr-3" />
          <span class="font-black uppercase tracking-widest text-[10px]">Export Database</span>
        </AppButton>
        <AppButton 
          variant="primary"
          class="!rounded-2xl !py-6 !px-8 bg-slate-900 hover:bg-violet-600 shadow-2xl transition-all"
          @click="router.push('/admin/collectors/new')"
        >
          <Plus class="w-4 h-4 mr-3" />
          <span class="font-black uppercase tracking-widest text-[10px]">Add Collector</span>
        </AppButton>
      </div>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Syncing collector database..."
      class="py-32"
    />
    
    <template v-else-if="collectors">
      <!-- High-Fidelity KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Force"
          :value="collectors.length.toString()"
          icon="Users"
          color="slate"
          description="Registered agents"
        />
        <MetricCard
          label="Active Now"
          :value="activeCollectorsCount.toString()"
          icon="Zap"
          color="green"
          description="In the field"
        />
        <MetricCard
          label="Avg. Collection"
          :value="formatCurrency(avgCollection, 'GHS')"
          icon="TrendingUp"
          color="purple"
          description="Per active shift"
        />
        <MetricCard
          label="Top Performer"
          :value="topCollectorName"
          icon="Trophy"
          color="amber"
          description="Highest daily impact"
        />
      </div>

      <!-- Search & Filters Bar -->
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="flex-1 relative w-full">
          <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <AppInput
            v-model="searchQuery"
            placeholder="Search by name, email or ID..."
            class="!pl-14 !py-7 !rounded-3xl !bg-white border-2 border-slate-100 focus:border-slate-900 shadow-sm transition-all"
          />
        </div>
        <AppSelect
          v-model="statusFilter"
          :options="statusOptions"
          class="w-full md:w-64 !py-7 !rounded-3xl !bg-white border-2 border-slate-100 shadow-sm"
        />
      </div>

      <!-- Data Grid -->
      <AppCard class="!rounded-[3rem] overflow-hidden border-2 border-slate-100 shadow-2xl bg-white">
        <AppTable
          :columns="columns"
          :rows="filteredCollectors"
          row-key="id"
          class="!border-none"
          empty-message="No operational collectors found matching criteria."
        >
          <template #cell:name="{ value, row }">
            <div class="flex items-center gap-5 py-2">
              <div class="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-sm font-black text-slate-400 shrink-0 relative overflow-hidden group-hover:border-slate-900 transition-all">
                <div class="absolute inset-0 bg-violet-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                {{ getInitials(value) }}
              </div>
              <div class="min-w-0">
                <p class="text-base font-black text-slate-900 truncate tracking-tight">
                  {{ value }}
                </p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {{ row.email }}
                </p>
              </div>
            </div>
          </template>

          <template #cell:status="{ value }">
            <CollectorStatusBadge 
              :status="value" 
              class="scale-90"
            />
          </template>

          <template #cell:totalCollectedToday="{ value }">
            <div class="flex flex-col">
              <span class="text-base font-black text-slate-900 tracking-tight">
                {{ formatCurrency(value, 'GHS') }}
              </span>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Today's Yield</span>
            </div>
          </template>

          <template #cell:lastActiveAt="{ value }">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-700">
                {{ value ? formatDate(value) : 'No Activity' }}
              </span>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Last Signal</span>
            </div>
          </template>

          <template #cell:actions="{ row }">
            <div class="flex items-center gap-3">
              <AppButton 
                variant="ghost" 
                size="sm" 
                class="!p-3 !rounded-xl text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                @click="selectedCollector = row"
              >
                <Eye class="w-5 h-5" />
              </AppButton>
              <AppButton 
                variant="ghost" 
                size="sm"
                class="!p-3 !rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Settings class="w-5 h-5" />
              </AppButton>
            </div>
          </template>
        </AppTable>
      </AppCard>
    </template>

    <!-- Collector Intelligence Drawer -->
    <DetailDrawer
      :is-open="!!selectedCollector"
      title="Collector Intelligence"
      :subtitle="selectedCollector?.id"
      @close="selectedCollector = null"
    >
      <div
        v-if="selectedCollector"
        class="space-y-12"
      >
        <!-- Profile High-Fidelity Header -->
        <section class="relative p-10 rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl flex flex-col items-center text-center">
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.5),transparent)]" />
          
          <div class="relative z-10 w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-6 ring-4 ring-white/5">
            {{ getInitials(selectedCollector.name) }}
          </div>
          
          <h3 class="relative z-10 text-3xl font-black text-white tracking-tighter italic uppercase">
            {{ selectedCollector.name }}
          </h3>
          <p class="relative z-10 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-3">
            {{ selectedCollector.email }}
          </p>
          
          <div class="relative z-10 mt-10 grid grid-cols-2 gap-6 w-full">
            <div class="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">
                Today's Yield
              </h4>
              <p class="text-2xl font-black text-white tracking-tight">
                {{ formatCurrency(selectedCollector.totalCollectedToday, 'GHS') }}
              </p>
            </div>
            <div class="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">
                Audit Trail
              </h4>
              <p class="text-2xl font-black text-white tracking-tight">
                {{ selectedCollector.receiptsIssuedToday }} <span class="text-xs text-white/40 uppercase">Rct</span>
              </p>
            </div>
          </div>

          <CollectorStatusBadge
            :status="selectedCollector.status"
            class="relative z-10 mt-8 scale-110"
          />
        </section>

        <!-- Operational Status -->
        <section class="space-y-6">
          <div class="flex items-center justify-between px-2">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Live Operational Status
            </h4>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">In Field</span>
            </div>
          </div>
          
          <div class="p-8 rounded-[2.5rem] border-2 border-slate-100 bg-slate-50/50 space-y-8">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-black text-slate-900 italic uppercase">
                  Assigned Scope
                </p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Multi-Event Authorization
                </p>
              </div>
              <span class="px-3 py-1 rounded-lg bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest">
                {{ selectedCollector.assignedEventCount }} Events
              </span>
            </div>
            
            <div class="h-[1px] bg-slate-200" />
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-black text-slate-900 italic uppercase">
                  Active Fund Authorization
                </p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Direct Recipient Allocation
                </p>
              </div>
              <span class="px-3 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                {{ selectedCollector.assignedFundCount }} Funds
              </span>
            </div>
          </div>
        </section>
        
        <!-- Block Rationale -->
        <section
          v-if="selectedCollector.status === 'Inactive' || selectedCollector.blockedReason"
          class="p-8 rounded-[2.5rem] bg-red-50/50 border-2 border-red-100"
        >
          <div class="flex items-center gap-3 mb-4">
            <ShieldAlert class="w-5 h-5 text-red-600" />
            <h4 class="text-[10px] font-black uppercase tracking-widest text-red-600">
              Operational Block Rationale
            </h4>
          </div>
          <p class="text-sm text-red-900/70 font-medium italic">
            "{{ selectedCollector.blockedReason || 'Collector has been deactivated by administrative override.' }}"
          </p>
        </section>
      </div>

      <template #actions>
        <AppButton
          class="flex-1 !rounded-2xl !py-4"
          variant="outline"
        >
          <Settings class="w-4 h-4 mr-3" />
          <span class="font-black uppercase tracking-widest text-[10px]">Configure Security</span>
        </AppButton>
        <AppButton
          class="flex-1 !rounded-2xl !py-4 bg-slate-900 hover:bg-violet-600 text-white shadow-xl transition-all"
          variant="primary"
        >
          <LayoutGrid class="w-4 h-4 mr-3" />
          <span class="font-black uppercase tracking-widest text-[10px]">Manage Shifts</span>
        </AppButton>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAllCollectors } from '../composables/useAllCollectors'
import type { CollectorProfile } from '../types/collector'
import CollectorStatusBadge from '../components/CollectorStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'
import { 
  Plus, 
  Download, 
  Eye, 
  Settings,
  Search,
  ShieldAlert,
  LayoutGrid
} from 'lucide-vue-next'

const router = useRouter()
const query = useAllCollectors()
const selectedCollector = ref<CollectorProfile | null>(null)

const searchQuery = ref('')
const statusFilter = ref('')

const columns = [
  { key: 'name', label: 'Collector' },
  { key: 'status', label: 'Status' },
  { key: 'totalCollectedToday', label: 'Today' },
  { key: 'lastActiveAt', label: 'Last Activity' },
  { key: 'actions', label: '' },
]

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const collectors = computed(() => query.data.value || [])

const filteredCollectors = computed(() => {
  let list = collectors.value
  
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(c => 
      c.name.toLowerCase().includes(s) || 
      c.email.toLowerCase().includes(s) ||
      c.id.toLowerCase().includes(s)
    )
  }
  
  if (statusFilter.value) {
    list = list.filter(c => c.status.toLowerCase() === statusFilter.value.toLowerCase())
  }
  
  return list
})

const activeCollectorsCount = computed(() => {
  return collectors.value.filter(c => c.status.toLowerCase() === 'active').length
})

const avgCollection = computed(() => {
  if (collectors.value.length === 0) return 0
  const total = collectors.value.reduce((acc, c) => acc + c.totalCollectedToday, 0)
  return total / collectors.value.length
})

const topCollectorName = computed(() => {
  if (collectors.value.length === 0) return '--'
  const sorted = [...collectors.value].sort((a, b) => b.totalCollectedToday - a.totalCollectedToday)
  return sorted[0].name.split(' ')[0]
})

function getInitials(name?: string) {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
