<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Collectors"
      description="Manage field collectors, assignments, performance, and cash collection access."
    >
      <template #actions>
        <AppButton 
          variant="primary"
          class="!rounded-xl shadow-premium"
          @click="router.push({ name: 'admin-collectors-new' })"
        >
          <Plus class="w-4 h-4 mr-2" /> Add Collector
        </AppButton>
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
        placeholder="Search collectors by name, email or phone..."
      />

      <DataTable
        :columns="columns"
        :rows="filteredCollectors"
        :loading="query.isLoading.value"
        exportable
        title="Collector Field Operations"
      >
        <template #cell:collector="{ row }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
              {{ getInitials(row.name) }}
            </div>
            <div class="flex flex-col">
              <span class="font-black text-slate-900 tracking-tight">{{ row.name }}</span>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ row.email }}</span>
            </div>
          </div>
        </template>

        <template #cell:today="{ row }">
          <MoneyCell :amount="row.totalCollectedToday" currency="GHS" />
        </template>

        <template #cell:month="{ row }">
          <MoneyCell :amount="row.totalCollectedToday * 12" currency="GHS" />
        </template>

        <template #cell:donations="{ row }">
          <span class="text-xs font-black text-slate-900">{{ row.receiptsIssuedToday }}</span>
        </template>

        <template #cell:assignments="{ row }">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-slate-900">{{ row.assignedEventCount }}</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Events</span>
          </div>
        </template>

        <template #cell:status="{ row }">
          <StatusBadge
            :status="row.status"
            :tone="row.status.toLowerCase() === 'active' ? 'success' : 'neutral'"
          />
        </template>

        <template #cell:lastActive="{ row }">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ row.lastActiveAt ? formatDate(row.lastActiveAt) : 'N/A' }}</span>
        </template>

        <template #rowActions="{ row }">
          <RowActions
            :actions="[
              { label: 'View Profile', icon: 'User', onClick: () => openDrawer(row) },
              { label: 'Edit', icon: 'Edit', onClick: () => router.push({ name: 'admin-collectors-edit', params: { id: row.id } }) },
              { label: 'Message', icon: 'Mail', onClick: () => {} },
              { label: 'Suspend', icon: 'ShieldAlert', onClick: () => {} }
            ]"
          />
        </template>
      </DataTable>
    </div>

    <!-- Detail Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Collector Intelligence"
      :subtitle="selectedCollector?.name"
      @close="isDrawerOpen = false"
    >
      <div v-if="selectedCollector" class="space-y-10">
        <section class="flex flex-col items-center text-center">
          <div class="w-24 h-24 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-center text-3xl font-black mb-6 shadow-premium">
            {{ getInitials(selectedCollector.name) }}
          </div>
          <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ selectedCollector.name }}</h3>
          <p class="text-slate-500 font-medium mt-1">{{ selectedCollector.email }}</p>
          <div class="mt-6 flex gap-3">
            <StatusBadge :status="selectedCollector.status" :tone="selectedCollector.status.toLowerCase() === 'active' ? 'success' : 'neutral'" />
            <StatusBadge status="Field Agent" tone="neutral" />
          </div>
        </section>

        <div class="grid grid-cols-2 gap-4">
          <AppCard class="!p-6 border-slate-100 bg-slate-50/50">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Yield</p>
            <p class="text-xl font-black text-slate-900 tracking-tight">{{ formatCurrency(selectedCollector.totalCollectedToday, 'GHS') }}</p>
          </AppCard>
          <AppCard class="!p-6 border-slate-100 bg-slate-50/50">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipts</p>
            <p class="text-xl font-black text-slate-900 tracking-tight">{{ selectedCollector.receiptsIssuedToday }}</p>
          </AppCard>
        </div>

        <section class="space-y-6 pt-6 border-t border-slate-100">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Scope</h4>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500">Assigned Events</span>
              <span class="text-xs font-black text-slate-900">{{ selectedCollector.assignedEventCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500">Assigned Funds</span>
              <span class="text-xs font-black text-slate-900">{{ selectedCollector.assignedFundCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500">Last Active</span>
              <span class="text-xs font-black text-slate-900">{{ selectedCollector.lastActiveAt ? formatDate(selectedCollector.lastActiveAt) : 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500">Device Link</span>
              <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Pixel 7 Pro (Active)</span>
            </div>
          </div>
        </section>

        <div v-if="selectedCollector.blockedReason" class="p-6 rounded-2xl bg-red-50 text-red-700">
          <p class="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Block Rationale</p>
          <p class="text-sm font-medium italic">"{{ selectedCollector.blockedReason }}"</p>
        </div>
      </div>

      <template #actions>
        <AppButton
          variant="primary"
          class="flex-1 !rounded-xl shadow-premium"
          @click="router.push({ name: 'admin-collectors-edit', params: { id: selectedCollector?.id } })"
        >
          Edit Collector
        </AppButton>
        <AppButton
          variant="outline"
          class="flex-1 !rounded-xl"
        >
          Message
        </AppButton>
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
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import MoneyCell from '@/shared/components/tables/MoneyCell.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import { Plus } from 'lucide-vue-next'
import type { CollectorProfile } from '../types/collector'

const router = useRouter()
const searchQuery = ref('')
const query = useAllCollectors()
const collectors = computed(() => query.data.value || [])

const isDrawerOpen = ref(false)
const selectedCollector = ref<CollectorProfile | null>(null)

const metrics = computed(() => ({
  active: collectors.value.filter(c => c.status.toLowerCase() === 'active').length,
  raisedToday: collectors.value.reduce((acc, c) => acc + c.totalCollectedToday, 0),
  topPerformer: collectors.value.length > 0 
    ? [...collectors.value].sort((a, b) => b.totalCollectedToday - a.totalCollectedToday)[0].name.split(' ')[0]
    : '--'
}))

const columns = [
  { key: 'collector', label: 'Collector' },
  { key: 'today', label: 'Today' },
  { key: 'month', label: 'Month' },
  { key: 'donations', label: 'Donations' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'status', label: 'Status' },
  { key: 'lastActive', label: 'Last Active' }
]

const filteredCollectors = computed(() => {
  if (!searchQuery.value) return collectors.value
  const q = searchQuery.value.toLowerCase()
  return collectors.value.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.email.toLowerCase().includes(q)
  )
})

function openDrawer(row: CollectorProfile) {
  selectedCollector.value = row
  isDrawerOpen.value = true
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
