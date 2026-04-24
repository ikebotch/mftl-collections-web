<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-display tracking-tight text-slate-900">
          Collectors
        </h1>
        <p class="text-slate-600 mt-2 font-medium">
          Manage and monitor your field collection agents.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <AppButton
          variant="outline"
          class="hidden sm:flex"
        >
          <Download class="w-4 h-4 mr-2" />
          Export
        </AppButton>
        <AppButton 
          variant="primary"
          @click="router.push('/admin/collectors/new')"
        >
          <Plus class="w-4 h-4 mr-2" />
          Add Collector
        </AppButton>
      </div>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading collector data..."
    />
    
    <template v-else-if="collectors">
      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Collectors"
          :value="collectors.length.toString()"
          icon="Users"
          color="purple"
        />
        <MetricCard
          label="Active Now"
          :value="activeCollectorsCount.toString()"
          icon="Zap"
          color="green"
        />
        <MetricCard
          label="Avg. Collection"
          :value="formatCurrency(avgCollection, 'GHS')"
          icon="TrendingUp"
          color="blue"
        />
        <MetricCard
          label="Top Performer"
          :value="topCollectorName"
          icon="Trophy"
          color="amber"
        />
      </div>

      <AppCard class="overflow-hidden">
        <AppTable
          :columns="columns"
          :rows="collectors"
          row-key="id"
          empty-message="No collectors registered yet."
        >
          <template #cell:name="{ value, row }">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 shrink-0">
                {{ getInitials(value) }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-bold text-slate-900 truncate">
                  {{ value }}
                </p>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  {{ row.email }}
                </p>
              </div>
            </div>
          </template>

          <template #cell:totalCollectedToday="{ value }">
            <div class="font-black text-slate-900">
              {{ formatCurrency(value, 'GHS') }}
            </div>
          </template>

          <template #cell:status="{ value }">
            <CollectorStatusBadge :status="value" />
          </template>

          <template #cell:lastActiveAt="{ value }">
            <div class="text-sm text-slate-600 font-medium">
              {{ value ? formatDate(value) : 'Never' }}
            </div>
          </template>

          <template #cell:actions="{ row }">
            <div class="flex items-center gap-2">
              <AppButton 
                variant="ghost" 
                size="sm" 
                @click="selectedCollector = row"
              >
                <Eye class="w-4 h-4" />
              </AppButton>
              <AppButton 
                variant="ghost" 
                size="sm"
              >
                <Settings class="w-4 h-4" />
              </AppButton>
            </div>
          </template>
        </AppTable>
      </AppCard>
    </template>

    <DetailDrawer
      :is-open="!!selectedCollector"
      title="Collector Profile"
      subtitle="Operational Intelligence"
      @close="selectedCollector = null"
    >
      <div
        v-if="selectedCollector"
        class="space-y-10"
      >
        <section class="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-2xl font-black text-slate-900 shadow-premium mb-4">
            {{ getInitials(selectedCollector.name) }}
          </div>
          <h3 class="text-xl font-bold text-slate-900">
            {{ selectedCollector.name }}
          </h3>
          <p class="text-slate-500 font-medium mt-1">
            {{ selectedCollector.email }}
          </p>
          
          <div class="mt-8 grid grid-cols-2 gap-4 w-full">
            <div class="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Today
              </h4>
              <p class="text-lg font-black text-slate-900">
                {{ formatCurrency(selectedCollector.totalCollectedToday, 'GHS') }}
              </p>
            </div>
            <div class="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Receipts
              </h4>
              <p class="text-lg font-black text-slate-900">
                {{ selectedCollector.receiptsIssuedToday }}
              </p>
            </div>
          </div>
          <CollectorStatusBadge
            :status="selectedCollector.status"
            class="mt-6 scale-110"
          />
        </section>

        <section>
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Current Assignments
            </h4>
            <span class="text-[10px] font-bold text-violet-600 uppercase tracking-widest">{{ selectedCollector.assignedEventCount }} Events</span>
          </div>
          <div class="space-y-3">
            <div class="p-4 rounded-xl border border-slate-100 flex items-center justify-between bg-white shadow-sm">
              <div>
                <p class="text-sm font-bold text-slate-900">
                  Active Shift Assignment
                </p>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  Assigned via Dashboard
                </p>
              </div>
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </section>
        
        <section
          v-if="selectedCollector.blockedReason"
          class="p-4 rounded-xl bg-red-50 border border-red-100"
        >
          <h4 class="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">
            Block Reason
          </h4>
          <p class="text-sm text-red-700 font-medium">
            {{ selectedCollector.blockedReason }}
          </p>
        </section>
      </div>

      <template #actions>
        <AppButton
          class="flex-1"
          variant="outline"
        >
          <Settings class="w-4 h-4 mr-2" />
          Configure
        </AppButton>
        <AppButton
          class="flex-1"
          variant="primary"
        >
          Manage Shifts
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
  Settings
} from 'lucide-vue-next'

const router = useRouter()
const query = useAllCollectors()
const selectedCollector = ref<CollectorProfile | null>(null)

const columns = [
  { key: 'name', label: 'Collector' },
  { key: 'status', label: 'Status' },
  { key: 'totalCollectedToday', label: 'Today' },
  { key: 'lastActiveAt', label: 'Last Activity' },
  { key: 'actions', label: '' },
]

const collectors = computed(() => query.data.value || [])

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
