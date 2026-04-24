<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppToolbar from '@/shared/components/toolbars/AppToolbar.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import { useCollectors } from '../composables/useCollector'
import type { CollectorRow } from '../types/collector'
import { 
  Plus, 
  Download, 
  User, 
  BarChart3,
  Settings
} from 'lucide-vue-next'

const router = useRouter()
const { data, isLoading, isError } = useCollectors()
const collectors = computed(() => data.value || [])

const columns = [
  { key: 'name', label: 'Collector' },
  { key: 'status', label: 'Status' },
  { key: 'totalCollected', label: 'Collections (Month)' },
  { key: 'lastActive', label: 'Last Active' },
  { key: 'actions', label: '' },
]

const activeCount = computed(() => (data.value || []).filter(c => c.status === 'Active').length)

const isDrawerOpen = ref(false)
const selectedCollector = ref<CollectorRow | null>(null)

function openDetail(row: CollectorRow) {
  selectedCollector.value = row
  isDrawerOpen.value = true
}
</script>

<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-display tracking-tight text-slate-900">
          Field Team
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          Manage collectors, supervisors, and their field performance.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <AppButton
          variant="outline"
          class="hidden sm:flex"
        >
          <Download class="w-4 h-4 mr-2" />
          Performance Export
        </AppButton>
        <AppButton 
          variant="primary"
          @click="router.push('/admin/collectors/new')"
        >
          <Plus class="w-4 h-4 mr-2" />
          Invite Collector
        </AppButton>
      </div>
    </div>

    <!-- KPI Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Active Collectors"
        :value="String(activeCount)"
        icon="Users"
        :is-loading="isLoading"
      />
      <MetricCard
        label="Monthly Collection"
        value="GHS --"
        icon="Wallet"
        color="green"
        :is-loading="isLoading"
      />
      <MetricCard
        label="Performance Avg"
        value="--"
        icon="Zap"
        :is-loading="isLoading"
      />
      <MetricCard
        label="System Health"
        value="Optimal"
        icon="Activity"
        color="green"
      />
    </div>

    <!-- Smart Filter Toolbar -->
    <AppToolbar>
      <AppInput
        id="collector-search"
        model-value=""
        label="Search"
        placeholder="Name, email, ID..."
      />
      <AppSelect
        id="collector-status"
        model-value=""
        label="Status"
        :options="[{ label: 'All Status', value: '' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]"
      />
      <template #actions>
        <AppButton
          variant="secondary"
          size="sm"
        >
          Reset
        </AppButton>
      </template>
    </AppToolbar>

    <AppCard class="overflow-hidden">
      <AppTable
        :columns="columns"
        :rows="collectors"
        row-key="id"
        :is-loading="isLoading"
        :is-error="isError"
      >
        <template #cell:name="{ value, row }">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shrink-0">
              <User class="w-6 h-6" />
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

        <template #cell:status="{ value }">
          <div 
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
            :class="value === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-600 border border-slate-200'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="value === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'"
            />
            {{ value }}
          </div>
        </template>

        <template #cell:totalCollected="{ value }">
          <span class="font-black text-slate-900">{{ value }}</span>
        </template>

        <template #cell:actions="{ row }">
          <div class="flex items-center gap-2">
            <AppButton
              variant="secondary"
              size="sm"
              @click="openDetail(row)"
            >
              Profile
            </AppButton>
          </div>
        </template>
      </AppTable>
    </AppCard>

    <!-- Detail Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Collector Profile"
      :subtitle="selectedCollector?.name"
      @close="isDrawerOpen = false"
    >
      <div
        v-if="selectedCollector"
        class="space-y-8"
      >
        <div class="flex flex-col items-center py-8 bg-slate-50 rounded-3xl border border-slate-100">
          <div class="w-24 h-24 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-300 mb-4">
            <User class="w-12 h-12" />
          </div>
          <h3 class="text-xl font-bold text-slate-900">
            {{ selectedCollector.name }}
          </h3>
          <p class="text-sm font-medium text-slate-500">
            {{ selectedCollector.email }}
          </p>
          <div class="mt-4">
            <span 
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
              :class="selectedCollector.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'"
            >
              {{ selectedCollector.status }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-white border border-slate-100 rounded-2xl">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Monthly Total
            </p>
            <p class="text-lg font-black text-slate-900">
              {{ selectedCollector.totalCollected }}
            </p>
          </div>
          <div class="p-4 bg-white border border-slate-100 rounded-2xl">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Assigned Events
            </p>
            <p class="text-lg font-black text-slate-900">
              {{ selectedCollector.activeEvents }}
            </p>
          </div>
        </div>

        <div class="space-y-3 pt-6 border-t border-slate-100">
          <AppButton
            variant="outline"
            class="w-full"
          >
            <BarChart3 class="w-4 h-4 mr-2" />
            Performance Report
          </AppButton>
          <AppButton
            variant="secondary"
            class="w-full"
          >
            <Settings class="w-4 h-4 mr-2" />
            Edit Access
          </AppButton>
        </div>
      </div>
    </DetailDrawer>
  </div>
</template>
