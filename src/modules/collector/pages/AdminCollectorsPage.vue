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
        <AppButton variant="primary">
          <Plus class="w-4 h-4 mr-2" />
          Add Collector
        </AppButton>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        label="Active Collectors"
        value="24"
        icon="Users"
        color="purple"
        trend="+2"
        trend-positive
      />
      <MetricCard
        label="Total Collections Today"
        value="GHS 12,450"
        icon="Wallet"
        color="green"
        trend="+15%"
        trend-positive
      />
      <MetricCard
        label="Avg. Collection/Agent"
        value="GHS 518"
        icon="BarChart3"
        color="blue"
      />
    </div>

    <AppCard class="overflow-hidden">
      <AppTable
        :columns="columns"
        :rows="collectors"
        row-key="id"
      >
        <template #cell:name="{ value, row }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
              <User class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-bold text-slate-900">
                {{ value }}
              </p>
              <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
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

        <template #cell:actions>
          <div class="flex items-center gap-2">
            <button class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-violet-600 transition-all">
              <Eye class="w-4 h-4" />
            </button>
            <button class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-violet-600 transition-all">
              <Settings class="w-4 h-4" />
            </button>
          </div>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import { 
  Plus, 
  Download, 
  User, 
  Eye, 
  Settings
} from 'lucide-vue-next'

const columns = [
  { key: 'name', label: 'Collector' },
  { key: 'status', label: 'Status' },
  { key: 'collections', label: 'Collections (Today)' },
  { key: 'lastActive', label: 'Last Active' },
  { key: 'actions', label: '' },
]

const collectors = [
  { id: 1, name: 'Kofi Mensah', email: 'kofi.mensah@mftl.com', status: 'Active', collections: 'GHS 1,200', lastActive: '2 mins ago' },
  { id: 2, name: 'Ama Serwaa', email: 'ama.serwaa@mftl.com', status: 'Active', collections: 'GHS 950', lastActive: '15 mins ago' },
  { id: 3, name: 'Kwame Appiah', email: 'kwame.appiah@mftl.com', status: 'Inactive', collections: 'GHS 0', lastActive: '2 days ago' },
  { id: 4, name: 'Abena Osei', email: 'abena.osei@mftl.com', status: 'Active', collections: 'GHS 2,100', lastActive: 'Just now' },
]
</script>
