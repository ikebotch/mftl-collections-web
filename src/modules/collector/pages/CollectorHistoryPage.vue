<template>
  <div class="space-y-8 pb-20">
    <!-- Page Header -->
    <AdminPageHeader
      title="Collection History"
      subtitle="All contributions you have recorded"
    />

    <!-- Summary Metrics -->
    <section class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <MetricCard
        label="Today's Total"
        :value="todayTotalFormatted"
        icon="TrendingUp"
        color="green"
      />
      <MetricCard
        label="Total Receipts"
        :value="String(filteredReceipts.length)"
        icon="FileText"
        color="purple"
      />
      <MetricCard
        label="Issued"
        :value="String(countByStatus('issued'))"
        icon="CheckCircle"
        color="blue"
      />
      <MetricCard
        label="Pending"
        :value="String(countByStatus('pending'))"
        icon="Clock"
        color="amber"
      />
    </section>

    <!-- Filter Tabs -->
    <div class="flex gap-1 bg-slate-100 p-1 w-fit">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="px-5 py-2 text-xs font-black uppercase tracking-widest transition-all duration-200 whitespace-nowrap"
        :class="activeFilter === filter.value
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-500 hover:text-slate-700'"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Data Table -->
    <LoadingState v-if="query.isLoading.value" text="Loading collection history…" />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load history"
      :message="query.error.value?.message ?? 'Please check your connection.'"
      show-retry
      @retry="query.refetch"
    />
    <template v-else>
      <div class="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          :columns="columns"
          :rows="filteredReceipts"
          :loading="query.isLoading.value"
          title="Collection History"
          empty-message="No collections recorded yet."
        >
          <template #cell:receiptNumber="{ value }">
            <span class="text-xs font-black text-slate-500 uppercase tracking-widest">{{ value }}</span>
          </template>

          <template #cell:contributorName="{ value }">
            <span class="text-sm font-bold text-slate-800">{{ value || 'Anonymous' }}</span>
          </template>

          <template #cell:amount="{ value }">
            <span class="text-sm font-black text-slate-900">{{ value }}</span>
          </template>

          <template #cell:eventTitle="{ value }">
            <span class="text-xs font-bold text-slate-600 truncate max-w-[160px] block">{{ value }}</span>
          </template>

          <template #cell:paymentMethod="{ value }">
            <span class="text-xs font-bold text-slate-500 uppercase">{{ value }}</span>
          </template>

          <template #cell:issuedAt="{ value }">
            <span class="text-xs text-slate-500 font-medium">{{ value }}</span>
          </template>

          <template #cell:status="{ row }">
            <ReceiptStatusBadge :status="row.status" />
          </template>

          <template #rowActions="{ row }">
            <button
              class="p-2 text-slate-400 hover:text-violet-600 transition-colors"
              @click="openReceipt(row)"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </template>
        </DataTable>
      </div>
    </template>

    <!-- Detail Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Contribution Details"
      :subtitle="selectedReceipt?.receiptNumber"
      @close="isDrawerOpen = false"
    >
      <ContributionDetailView
        v-if="selectedReceipt"
        :contribution="selectedReceipt"
      />
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCollectorHistory } from '../composables/useCollector'
import { formatCurrency } from '@/core/formatting/formatters'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import ContributionDetailView from '@/modules/contributions/components/ContributionDetailView.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { ChevronRight } from 'lucide-vue-next'

const query = useCollectorHistory()
const activeFilter = ref<'all' | 'issued' | 'pending' | 'voided'>('all')
const isDrawerOpen = ref(false)
const selectedReceipt = ref<any>(null)

function openReceipt(receipt: any) {
  selectedReceipt.value = receipt
  isDrawerOpen.value = true
}

const columns = [
  { key: 'issuedAt', label: 'Date', sortable: true },
  { key: 'receiptNumber', label: 'Receipt #', sortable: true },
  { key: 'contributorName', label: 'Contributor', sortable: true },
  { key: 'eventTitle', label: 'Event', sortable: true },
  { key: 'paymentMethod', label: 'Method', sortable: false },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const filters = [
  { label: 'All', value: 'all' as const },
  { label: 'Issued', value: 'issued' as const },
  { label: 'Pending', value: 'pending' as const },
  { label: 'Voided', value: 'voided' as const },
]

const filteredReceipts = computed(() => {
  const receipts = query.data.value ?? []
  if (activeFilter.value === 'all') return receipts
  return receipts.filter(r => r.status.toLowerCase() === activeFilter.value)
})

function countByStatus(status: string) {
  return (query.data.value ?? []).filter(r => r.status.toLowerCase() === status).length
}

/** Compute today's total only from receipts issued today */
const todayTotalFormatted = computed(() => {
  const receipts = query.data.value ?? []
  const today = new Date().toDateString()
  let total = 0
  let currency = 'GHS'

  for (const r of receipts) {
    try {
      const d = new Date(r.issuedAt)
      if (d.toDateString() === today) {
        total += r.amountValue ?? 0
        currency = r.currency || currency
      }
    } catch {
      // skip malformed dates
    }
  }

  return formatCurrency(total, currency)
})
</script>
