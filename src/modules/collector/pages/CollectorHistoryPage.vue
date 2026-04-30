<template>
  <!--
    Breakpoints
    phone  < 768px : full-screen, no table, card list, sticky bottom nav
    tablet 768–1199: metric cards + scrollable table
    desktop >= 1200: metric row + full data table + detail drawer on click
  -->
  <div class="pb-24 md:pb-8 space-y-0 md:space-y-6">

    <!-- ══════════════════════════════════════════════════
         PHONE HEADER  (< 768 px)
    ══════════════════════════════════════════════════ -->
    <header class="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">History</p>
        <h1 class="text-base font-black text-slate-900">My Collections</h1>
      </div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide"
          @click="() => query.refetch()"
        >
          Sync
        </button>
      </div>
    </header>

    <!-- TABLET / DESKTOP HEADER -->
    <AdminPageHeader
      class="hidden md:flex"
      title="Collection History"
      description="All contributions you have recorded"
    />

    <!-- ══════════════════════════════════════════════════
         METRIC STRIP
         phone: 2-col compact / tablet+: 4-col cards
    ══════════════════════════════════════════════════ -->
    <section>
      <!-- Phone: compact horizontal strip -->
      <div class="md:hidden grid grid-cols-2 gap-2 px-4 py-3">
        <div class="bg-slate-50 border border-slate-100 rounded px-3 py-2.5">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Today</p>
          <p class="text-base font-black text-slate-900 mt-0.5">{{ todayTotalFormatted }}</p>
        </div>
        <div class="bg-slate-50 border border-slate-100 rounded px-3 py-2.5">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
          <p class="text-base font-black text-slate-900 mt-0.5">{{ filteredReceipts.length }}</p>
        </div>
        <div class="bg-slate-50 border border-slate-100 rounded px-3 py-2.5">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Issued</p>
          <p class="text-base font-black text-slate-900 mt-0.5">{{ countByStatus('issued') }}</p>
        </div>
        <div class="bg-slate-50 border border-slate-100 rounded px-3 py-2.5">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pending</p>
          <p class="text-base font-black text-slate-900 mt-0.5">{{ countByStatus('pending') }}</p>
        </div>
      </div>

      <!-- Tablet / Desktop: proper MetricCards -->
      <div class="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Today's Total" :value="todayTotalFormatted" icon="TrendingUp" color="green" />
        <MetricCard label="Total Receipts" :value="String(filteredReceipts.length)" icon="FileText" color="purple" />
        <MetricCard label="Issued" :value="String(countByStatus('issued'))" icon="CheckCircle" color="blue" />
        <MetricCard label="Pending" :value="String(countByStatus('pending'))" icon="Clock" color="amber" />
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         FILTER TABS  (shared across all breakpoints)
    ══════════════════════════════════════════════════ -->
    <div class="flex gap-0 overflow-x-auto scrollbar-none px-4 md:px-0">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="px-4 py-2.5 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 shrink-0"
        :class="activeFilter === filter.value
          ? 'border-violet-600 text-violet-700 bg-violet-50 md:bg-transparent'
          : 'border-transparent text-slate-400 hover:text-slate-700'"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════
         Loading / Error
    ══════════════════════════════════════════════════ -->
    <div class="px-4 md:px-0">
      <LoadingState v-if="query.isLoading.value" text="Loading collection history…" />
      <ErrorState
        v-else-if="query.isError.value"
        title="Could not load history"
        :message="query.error.value?.message ?? 'Check your connection.'"
        show-retry
        @retry="query.refetch"
      />
    </div>

    <template v-if="!query.isLoading.value && !query.isError.value">

      <!-- ══════════════════════════════════════════════════
           PHONE: Card list (no table)
      ══════════════════════════════════════════════════ -->
      <div class="md:hidden">
        <div v-if="!filteredReceipts.length" class="px-4 py-12 text-center text-sm text-slate-400 font-medium">
          No collections recorded yet.
        </div>

        <div class="bg-white border-y border-slate-100 divide-y divide-slate-100">
          <div
            v-for="receipt in filteredReceipts"
            :key="receipt.id"
            class="px-4 py-4 flex items-center justify-between gap-3 active:bg-slate-50 transition-colors cursor-pointer min-h-[64px]"
            @click="openReceipt(receipt)"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <FileText class="w-4 h-4" />
              </div>
              <div class="min-w-0">
                <p class="text-xs font-black text-slate-900 uppercase truncate">
                  {{ receipt.contributorName || 'Anonymous' }}
                </p>
                <p class="text-[11px] text-slate-400 font-medium truncate">
                  {{ receipt.eventTitle }} · {{ receipt.paymentMethod }}
                </p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-black text-slate-900">{{ receipt.amount }}</p>
              <ReceiptStatusBadge :status="receipt.status" class="scale-75 origin-right" />
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           TABLET / DESKTOP: Data table
      ══════════════════════════════════════════════════ -->
      <div class="hidden md:block bg-white border border-slate-200 shadow-sm overflow-hidden">
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
            <button class="p-2 text-slate-400 hover:text-violet-600 transition-colors" @click="openReceipt(row)">
              <ChevronRight class="w-4 h-4" />
            </button>
          </template>
        </DataTable>
      </div>

    </template>

    <!-- Detail Drawer (all breakpoints — slides in from right on phone too) -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Contribution Details"
      :subtitle="selectedReceipt?.receiptNumber"
      @close="isDrawerOpen = false"
    >
      <ContributionDetailView v-if="selectedReceipt" :contribution="selectedReceipt" />
    </DetailDrawer>

    <!-- ══════════════════════════════════════════════════
         PHONE: Sticky bottom new-collection CTA
    ══════════════════════════════════════════════════ -->
    <div class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 px-4 py-3 safe-area-bottom z-30">
      <button
        class="w-full bg-violet-600 text-white py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 active:opacity-90 transition-opacity"
        @click="$router.push('/collector/contributions/new')"
      >
        <Plus class="w-4 h-4" />
        Record New Collection
      </button>
    </div>
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
import { ChevronRight, FileText, Plus } from 'lucide-vue-next'

// const router = useRouter()
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

/** Only count today's receipts — not all time */
const todayTotalFormatted = computed(() => {
  const receipts = query.data.value ?? []
  const today = new Date().toDateString()
  let total = 0
  let currency = 'GHS'
  for (const r of receipts) {
    try {
      if (new Date(r.issuedAt).toDateString() === today) {
        total += r.amountValue ?? 0
        currency = r.currency || currency
      }
    } catch { /* skip malformed dates */ }
  }
  return formatCurrency(total, currency)
})
</script>
