<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Funds"
      description="Track recipient funds, targets, collections, and currency-specific balances."
    >
      <template #actions>
        <AppButton
          variant="primary"
          class="!rounded-xl shadow-premium"
          @click="router.push({ name: 'admin-funds-new' })"
        >
          <Plus class="w-4 h-4 mr-2" /> New Fund
        </AppButton>
      </template>
    </AdminPageHeader>

    <AdminMetricGrid>
      <MetricCard
        label="Total Funds"
        :value="funds.length.toString()"
        icon="LayoutGrid"
        color="slate"
        trend="+2 this week"
      />
      <MetricCard
        label="Fully Funded"
        :value="funds.filter(f => calculateProgressValue(f) >= f.targetAmount).length.toString()"
        icon="CheckCircle"
        color="green"
        trend="10% of total"
      />
      <MetricCard
        label="Active Targets"
        :value="funds.filter(f => calculateProgressValue(f) < f.targetAmount).length.toString()"
        icon="Target"
        color="amber"
      />
      <MetricCard
        label="Total Raised"
        :value="aggregateTotals(funds)"
        icon="TrendingUp"
        color="purple"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search funds..."
      />

      <DataTable
        :columns="columns"
        :rows="filteredFunds"
        :loading="query.isLoading.value"
      >
        <template #cell:fund="{ row }">
          <div class="flex flex-col">
            <span class="font-black text-slate-900 tracking-tight">{{ row.name }}</span>
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ row.id.split('-')[0] }}</span>
          </div>
        </template>

        <template #cell:event="{ row }">
          <span class="text-xs font-bold text-slate-600">#{{ row.eventId.slice(0, 8) }}</span>
        </template>

        <template #cell:raised="{ row }">
          <div class="flex flex-col gap-1">
            <div v-for="t in row.totals" :key="t.currency">
              <MoneyCell
                :amount="t.amount"
                :currency="t.currency"
              />
            </div>
            <div v-if="!row.totals?.length">
              <MoneyCell :amount="0" currency="GHS" />
            </div>
            <div class="mt-2 w-24">
              <ProgressBar
                :value="calculateProgressValue(row)"
                :max="row.targetAmount"
                color="emerald"
              />
            </div>
          </div>
        </template>

        <template #cell:currency="{ row }">
          <span class="text-[10px] font-black text-slate-900 tracking-widest">{{ row.totals?.map((t: any) => t.currency).join(', ') || 'GHS' }}</span>
        </template>

        <template #cell:status="{ row }">
          <StatusBadge
            :status="calculateProgressValue(row) >= row.targetAmount ? 'completed' : 'active'"
            :tone="calculateProgressValue(row) >= row.targetAmount ? 'success' : 'neutral'"
          />
        </template>

        <template #rowActions="{ row }">
          <RowActions
            :actions="[
              { label: 'View', icon: 'Eye', onClick: () => router.push({ name: 'admin-funds-detail', params: { id: row.id } }) },
              { label: 'Edit', icon: 'Edit', onClick: () => router.push({ name: 'admin-funds-edit', params: { id: row.id } }) }
            ]"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAllRecipientFunds } from '../composables/useRecipientFunds'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import MoneyCell from '@/shared/components/tables/MoneyCell.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import ProgressBar from '@/shared/components/feedback/ProgressBar.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import { Plus } from 'lucide-vue-next'
import { formatCurrency } from '@/core/formatting/formatters'

const router = useRouter()
const searchQuery = ref('')
const query = useAllRecipientFunds()
const funds = computed(() => query.data.value || [])

const columns = [
  { key: 'fund', label: 'Fund' },
  { key: 'event', label: 'Event ID' },
  { key: 'raised', label: 'Raised' },
  { key: 'currency', label: 'Currency' },
  { key: 'status', label: 'Status' }
]

const filteredFunds = computed(() => {
  if (!searchQuery.value) return funds.value
  const q = searchQuery.value.toLowerCase()
  return funds.value.filter(f => 
    f.name.toLowerCase().includes(q)
  )
})

function aggregateTotals(list: any[]) {
  const map: Record<string, number> = {}
  list.forEach(f => {
    f.totals?.forEach((t: any) => {
      map[t.currency] = (map[t.currency] || 0) + t.amount
    })
  })
  const entries = Object.entries(map)
  if (entries.length === 0) return 'GHS 0.00'
  return entries.map(([curr, amt]) => formatCurrency(amt, curr)).join(' • ')
}

function calculateProgressValue(fund: any) {
  return fund.totals?.find((t: any) => t.currency === 'GHS')?.amount ?? 0
}
</script>
