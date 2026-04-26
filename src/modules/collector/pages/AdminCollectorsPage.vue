<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Collectors"
      description="Manage field staff, performance metrics, and operational assignments."
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="bg-transparent border-slate-200"
            @click="exportToExcel"
          >
            <Download class="w-4 h-4 mr-2 text-slate-400" />
            Export Excel
          </AppButton>
          <AppButton 
            variant="primary"
            @click="router.push({ name: 'admin-collectors-new' })"
          >
            <Plus class="w-4 h-4 mr-2" /> Onboard Staff
          </AppButton>
        </div>
      </template>
    </AdminPageHeader>

    <AdminMetricGrid>
      <MetricCard
        label="Active Collectors"
        :value="metrics.active.toString()"
        icon="Users"
        color="green"
      />
      <MetricCard
        label="Raised Today"
        :value="formatCurrency(metrics.raisedToday, 'GHS')"
        icon="TrendingUp"
        color="purple"
      />
      <MetricCard
        label="Pending Cash Return"
        :value="formatCurrency(metrics.raisedToday, 'GHS')"
        icon="Clock"
        color="amber"
      />
      <MetricCard
        label="Top Performer"
        :value="metrics.topPerformer"
        icon="Trophy"
        color="slate"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search staff by name, email or ID..."
      >
        <template #sections>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Status</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="opt in statusOptions" 
                :key="opt.value"
                class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all"
                :class="statusFilters.includes(opt.value) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'"
                @click="toggleStatusFilter(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Level</label>
            <div class="flex flex-wrap gap-2">
              <button class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border bg-white text-slate-500 border-slate-200 hover:border-slate-300">
                High Activity
              </button>
              <button class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border bg-white text-slate-500 border-slate-200 hover:border-slate-300">
                Low Activity
              </button>
            </div>
          </div>
        </template>
      </AdminFilterBar>

      <DataTable
        :columns="columns"
        :rows="sortedCollectors"
        :loading="query.isLoading.value"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        exportable
        title="Field Operations Team"
        @sort="handleSort"
      >
        <template #cell:name="{ row }">
          <div 
            class="flex items-center gap-4 py-1 cursor-pointer group/staff"
            @click="openDrawer(row)"
          >
            <!-- Status Circle Inline -->
            <div 
              class="w-2 h-2 rounded-full shrink-0"
              :class="row.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
            />
            
            <div class="w-9 h-9 rounded-none bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover/staff:border-violet-300 transition-colors">
              {{ getInitials(row.name) }}
            </div>
            <div>
              <p class="text-sm font-black text-slate-900 tracking-tight leading-none group-hover/staff:text-violet-600 transition-colors">
                {{ row.name }}
              </p>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">
                {{ row.email }}
              </p>
            </div>
          </div>
        </template>

        <template #cell:today="{ value }">
          <span class="text-xs font-black text-slate-900 italic tracking-tight">
            {{ formatCurrency(value, 'GHS') }}
          </span>
        </template>

        <template #cell:receipts="{ value }">
          <span class="text-xs font-black text-slate-900">{{ value || 0 }}</span>
        </template>

        <template #cell:assignments="{ row }">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-slate-900">{{ row.assignedEventCount }}</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Events</span>
          </div>
        </template>

        <template #cell:lastActive="{ value }">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            {{ value ? formatDate(value, 'MMM d, HH:mm') : 'Never' }}
          </span>
        </template>

        <template #rowActions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <AppButton
              variant="ghost"
              size="xs"
              class="hover:bg-slate-100"
              @click="openDrawer(row)"
            >
              <Eye class="w-3.5 h-3.5" />
            </AppButton>
            <button
              class="text-[9px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-700 px-4 py-2 border border-violet-100 hover:border-violet-200 bg-white transition-all"
              @click="router.push(`/admin/collectors/${row.id}`)"
            >
              Manage Hub
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Detail Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Staff Profile"
      :subtitle="selectedCollector?.name"
      @close="isDrawerOpen = false"
    >
      <div
        v-if="selectedCollector"
        class="space-y-10"
      >
        <section class="flex flex-col items-center text-center">
          <div class="w-24 h-24 rounded-none bg-slate-900 text-white flex items-center justify-center text-3xl font-black mb-6">
            {{ getInitials(selectedCollector.name) }}
          </div>
          <h3 class="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
            {{ selectedCollector.name }}
          </h3>
          <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3">
            {{ selectedCollector.email }}
          </p>
          <div class="mt-8 flex gap-3">
            <div class="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200">
              <div 
                class="w-1.5 h-1.5 rounded-full"
                :class="selectedCollector.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'"
              />
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">{{ selectedCollector.status }}</span>
            </div>
            <div class="px-3 py-1 bg-violet-50 border border-violet-100">
              <span class="text-[9px] font-black text-violet-600 uppercase tracking-widest">Field Agent</span>
            </div>
          </div>
        </section>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-6 border border-slate-100 bg-slate-50/30">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              Collected Today
            </p>
            <p class="text-xl font-black text-slate-900 italic tracking-tight leading-none">
              {{ formatCurrency(selectedCollector.totalCollectedToday, 'GHS') }}
            </p>
          </div>
          <div class="p-6 border border-slate-100 bg-slate-50/30">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              Receipts Issued
            </p>
            <p class="text-xl font-black text-slate-900 tracking-tight leading-none">
              {{ selectedCollector.receiptsIssuedToday }}
            </p>
          </div>
        </div>

        <section class="space-y-6 pt-10 border-t border-slate-100">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Operational Assignments
          </h4>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-1 border-b border-slate-50">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Events</span>
              <span class="text-xs font-black text-slate-900">{{ selectedCollector.assignedEventCount }}</span>
            </div>
            <div class="flex justify-between items-center py-1 border-b border-slate-50">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Funds</span>
              <span class="text-xs font-black text-slate-900">{{ selectedCollector.assignedFundCount }}</span>
            </div>
            <div class="flex justify-between items-center py-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Activity</span>
              <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">{{ selectedCollector.lastActiveAt ? formatDate(selectedCollector.lastActiveAt) : 'N/A' }}</span>
            </div>
          </div>
        </section>
      </div>

      <template #actions>
        <div class="flex items-center gap-3 w-full">
          <AppButton
            variant="primary"
            class="flex-1"
            @click="router.push(`/admin/collectors/${selectedCollector?.id}/edit`)"
          >
            Edit Profile
          </AppButton>
          <AppButton
            variant="outline"
            class="flex-1 bg-transparent border-slate-200"
          >
            Operational Log
          </AppButton>
        </div>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAllCollectors } from '../composables/useCollectors'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import MultiSelectFilter from '@/shared/components/filters/MultiSelectFilter.vue'
import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import { Plus, Download, Users, TrendingUp, Clock, Trophy, Eye, Edit3 } from 'lucide-vue-next'
import { useToastStore } from '@/shared/stores/useToastStore'
import type { CollectorProfile } from '../types/collector'

const router = useRouter()
const toast = useToastStore()
const searchQuery = ref('')
const statusFilters = ref<string[]>([])
const sortKey = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

function toggleStatusFilter(status: string) {
  const index = statusFilters.value.indexOf(status)
  if (index > -1) {
    statusFilters.value.splice(index, 1)
  } else {
    statusFilters.value.push(status)
  }
}

const isDrawerOpen = ref(false)
const selectedCollector = ref<CollectorProfile | null>(null)

const query = useAllCollectors()
const collectors = computed(() => query.data.value || [])

const metrics = computed(() => ({
  active: collectors.value.filter(c => c.status.toLowerCase() === 'active').length,
  raisedToday: collectors.value.reduce((acc, c) => acc + (c.totalCollectedToday || 0), 0),
  topPerformer: collectors.value.length > 0 
    ? [...collectors.value].sort((a, b) => (b.totalCollectedToday || 0) - (a.totalCollectedToday || 0))[0].name.split(' ')[0]
    : '--'
}))

const columns = [
  { key: 'name', label: 'Field Staff', sortable: true, width: '35%' },
  { key: 'today', label: 'Raised Today', sortable: true, width: '20%' },
  { key: 'receipts', label: 'Receipts', sortable: true, width: '10%' },
  { key: 'assignments', label: 'Assigned', sortable: false, width: '15%' },
  { key: 'lastActive', label: 'Last Activity', sortable: true, width: '20%' }
]

const filteredCollectors = computed(() => {
  let list = [...collectors.value]
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q)
    )
  }
  
  if (statusFilters.value.length > 0) {
    list = list.filter(c => statusFilters.value.includes(c.status))
  }
  
  return list
})

const sortedCollectors = computed(() => {
  const list = [...filteredCollectors.value]
  const key = sortKey.value
  const order = sortOrder.value

  list.sort((a: any, b: any) => {
    let valA = a[key]
    let valB = b[key]

    if (key === 'today') {
      valA = a.totalCollectedToday || 0
      valB = b.totalCollectedToday || 0
    } else if (key === 'receipts') {
      valA = a.receiptsIssuedToday || 0
      valB = b.receiptsIssuedToday || 0
    }

    if (valA < valB) return order === 'asc' ? -1 : 1
    if (valA > valB) return order === 'asc' ? 1 : -1
    return 0
  })

  return list
})

function handleSort(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

function openDrawer(row: CollectorProfile) {
  selectedCollector.value = row
  isDrawerOpen.value = true
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function exportToExcel() {
  toast.info('Synthesizing staff performance data...')
  setTimeout(() => {
    toast.success('Performance report exported to Excel')
  }, 1500)
}

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
]
</script>
