<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Settlements"
      description="Manage cash reconciliation, field agent handovers, and treasury settlements."
    >
      <template #actions>
        <AppButton
          variant="outline"
          class="!rounded-xl bg-white shadow-sm border-slate-200"
        >
          <Download class="w-4 h-4 mr-2 text-slate-400" />
          Export Ledger
        </AppButton>
      </template>
    </AdminPageHeader>

    <!-- Operational State Alert -->
    <section class="p-8 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-6 relative overflow-hidden">
      <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
        <Database class="w-6 h-6" />
      </div>
      <div class="space-y-2">
        <h2 class="text-lg font-black text-slate-900 tracking-tight uppercase italic">
          Settlement Engine Pending
        </h2>
        <p class="text-xs font-bold text-amber-900/60 uppercase tracking-widest">
          API Bridge Not Active
        </p>
        <p class="text-slate-600 font-medium max-w-2xl text-xs leading-relaxed">
          The settlement engine is currently being finalized. This module will allow finance teams to reconcile physical cash collected in the field with digital audit logs once the backend orchestration is complete.
        </p>
      </div>
    </section>

    <AdminMetricGrid>
      <MetricCard
        label="Pending Reconciliation"
        value="GHS 5,290.50"
        icon="Wallet"
        color="amber"
      />
      <MetricCard
        label="Awaiting Handover"
        value="3 Collectors"
        icon="UserCheck"
        color="blue"
      />
      <MetricCard
        label="Completed Today"
        value="1"
        icon="CheckCircle"
        color="green"
      />
      <MetricCard
        label="Treasury Status"
        value="Normal"
        icon="ShieldCheck"
        color="purple"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search collectors or status..."
      />

      <DataTable
        :columns="columns"
        :rows="mockSettlements"
        @retry="() => {}"
      >
        <template #cell:collectorName="{ value }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 shrink-0">
              {{ getInitials(value) }}
            </div>
            <span class="text-sm font-black text-slate-900 tracking-tight">{{ value }}</span>
          </div>
        </template>

        <template #cell:amount="{ value }">
          <span class="text-sm font-black text-slate-900 italic">{{ formatCurrency(value, 'GHS') }}</span>
        </template>

        <template #cell:status="{ value }">
          <StatusBadge
            :status="value"
            :tone="getStatusTone(value)"
          />
        </template>

        <template #cell:date="{ value }">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ value }}</span>
        </template>

        <template #rowActions>
          <RowActions
            :actions="[
              { label: 'View Audit Log', icon: 'FileText', onClick: () => {} },
              { label: 'Mark as Handed Over', icon: 'Handshake', onClick: () => {} }
            ]"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatCurrency } from '@/shared/utils/formatters'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { Database, Download } from 'lucide-vue-next'

const searchQuery = ref('')

const columns = [
  { key: 'collectorName', label: 'Collector', sortable: true },
  { key: 'amount', label: 'Cash Pending', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Collection Date' },
]

const mockSettlements = [
  { id: '1', collectorName: 'Samuel Osei', amount: 1250.00, status: 'Awaiting Handover', date: 'Oct 24, 2023' },
  { id: '2', collectorName: 'Grace Mensah', amount: 840.50, status: 'In Review', date: 'Oct 24, 2023' },
  { id: '3', collectorName: 'Isaac Boateng', amount: 3200.00, status: 'Awaiting Handover', date: 'Oct 23, 2023' },
  { id: '4', collectorName: 'Akosua Serwaa', amount: 150.00, status: 'Completed', date: 'Oct 22, 2023' },
]

function getInitials(name?: string) {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getStatusTone(status: string): 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
  if (status.includes('Handover')) return 'warning'
  if (status.includes('Completed')) return 'success'
  if (status.includes('Review')) return 'info'
  return 'neutral'
}
</script>
