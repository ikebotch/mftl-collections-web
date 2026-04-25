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

    <AdminMetricGrid>
      <MetricCard
        label="Pending Reconciliation"
        :value="pendingReconciliation"
        icon="Wallet"
        color="amber"
      />
      <MetricCard
        label="Awaiting Handover"
        :value="awaitingHandover"
        icon="UserCheck"
        color="blue"
      />
      <MetricCard
        label="Completed Records"
        :value="String((query.data.value ?? []).filter(s => s.status.includes('Completed')).length)"
        icon="CheckCircle"
        color="green"
      />
      <MetricCard
        label="System Integrity"
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
        :rows="query.data.value ?? []"
        :loading="query.isLoading.value"
        exportable
        title="Settlement Reconciliation"
        @retry="query.refetch"
      >
        <template #cell:collectorName="{ value }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 shrink-0">
              {{ getInitials(value) }}
            </div>
            <span class="text-sm font-black text-slate-900 tracking-tight">{{ value }}</span>
          </div>
        </template>

        <template #cell:amount="{ row }">
          <span class="text-sm font-black text-slate-900 italic">{{ formatCurrency(row.amount, row.currency) }}</span>
        </template>

        <template #cell:status="{ value }">
          <StatusBadge
            :status="value"
            :tone="getStatusTone(value)"
          />
        </template>

        <template #cell:date="{ value }">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ formatDate(value) }}</span>
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
import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import { useSettlements } from '../composables/useSettlements'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { Download } from 'lucide-vue-next'

const query = useSettlements()
const searchQuery = ref('')

const columns = [
  { key: 'collectorName', label: 'Collector', sortable: true },
  { key: 'amount', label: 'Cash Pending', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Collection Date' },
]

const pendingReconciliation = computed(() => {
  const list = query.data.value ?? []
  const total = list.filter(s => !s.status.includes('Completed')).reduce((acc, s) => acc + s.amount, 0)
  return formatCurrency(total, 'GHS')
})

const awaitingHandover = computed(() => {
  const list = query.data.value ?? []
  const count = list.filter(s => s.status.includes('Handover')).length
  return `${count} Collector${count !== 1 ? 's' : ''}`
})

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
