<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Self-Donation Log"
      description="Monitor and audit direct contributions made by registered users."
    />

    <AdminMetricGrid>
      <MetricCard
        label="Total Self-Donations"
        :value="query.data.value?.length.toString() || '0'"
        icon="History"
        color="slate"
      />
      <MetricCard
        label="Total Volume"
        :value="formattedTotalVolume"
        icon="TrendingUp"
        color="purple"
      />
      <MetricCard
        label="Direct Channels"
        value="Web / App"
        icon="Smartphone"
        color="blue"
      />
      <MetricCard
        label="Audit Status"
        value="Verified"
        icon="ShieldCheck"
        color="green"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search by ID or status..."
      />

      <DataTable
        :columns="columns"
        :rows="filteredItems"
        :loading="query.isLoading.value"
        exportable
        title="Self-Donation Ledger"
      >
        <template #cell:id="{ value }">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">#{{ value.slice(0, 8) }}</span>
        </template>

        <template #cell:amount="{ value }">
          <span class="text-sm font-black text-slate-900">{{ value }}</span>
        </template>

        <template #cell:status="{ row }">
          <StatusBadge :status="row.receiptStatus" :tone="row.receiptStatus.toLowerCase() === 'issued' ? 'success' : 'neutral'" />
        </template>

        <template #rowActions>
          <RowActions
            :actions="[
              { label: 'View Receipt', icon: 'FileText', onClick: () => {} },
              { label: 'Audit Log', icon: 'Shield', onClick: () => {} }
            ]"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopy } from '@/core/i18n/useCopy'
import { useSelfDonations } from '../composables/useSelfDonations'

const { copy } = useCopy()
const query = useSelfDonations()
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import { formatCurrency } from '@/core/formatting/formatters'

const searchQuery = ref('')

const columns = [
  { key: 'id', label: 'Reference' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' }
]

const formattedTotalVolume = computed(() => {
  const items = query.data.value ?? []
  const currencyGroups: Record<string, number> = {}
  
  items.forEach(item => {
    const amt = parseFloat(item.amount.replace(/[^0-9.]/g, ''))
    const cur = item.amount.split(' ')[0] || 'GHS'
    if (!isNaN(amt)) {
      currencyGroups[cur] = (currencyGroups[cur] || 0) + amt
    }
  })
  
  if (Object.keys(currencyGroups).length === 0) return 'GHS 0.00'
  return Object.entries(currencyGroups)
    .map(([cur, amt]) => formatCurrency(amt, cur))
    .join(' • ')
})

const filteredItems = computed(() => {
  const items = query.data.value ?? []
  if (!searchQuery.value) return items
  const q = searchQuery.value.toLowerCase()
  return items.filter(i => 
    i.id.toLowerCase().includes(q) || 
    i.receiptStatus.toLowerCase().includes(q)
  )
})
</script>
