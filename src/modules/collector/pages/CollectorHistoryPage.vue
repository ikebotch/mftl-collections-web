<template>
  <div class="space-y-8 pb-32">
    <header class="pt-2">
      <h2 class="text-3xl font-black text-white tracking-tight">
        History
      </h2>
      <p class="text-slate-400 mt-1 font-medium">
        Review your past collections.
      </p>
    </header>

    <!-- Daily Summary -->
    <div class="relative overflow-hidden p-8 rounded-none bg-gradient-to-br from-violet-600 to-indigo-700 shadow-premium group">
      <!-- Decorative glow -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/20 rounded-none blur-[80px]" />
       
      <div class="relative z-10 flex items-center justify-between">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200/70">
            Total Collected Today
          </p>
          <p class="text-4xl font-black text-white mt-1 tracking-tighter">
            {{ formatCurrency(dailyTotal, 'GHS') }}
          </p>
          <div class="mt-4 flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-none bg-white/10 text-[9px] font-black text-white uppercase tracking-widest">
              {{ query.data.value?.length || 0 }} Receipts
            </span>
          </div>
        </div>
        <div class="w-14 h-14 rounded-none bg-white/10 flex items-center justify-center text-white border border-white/10">
          <Wallet class="w-7 h-7" />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 p-1.5 rounded-none bg-white/[0.03] border border-white/5 overflow-x-auto no-scrollbar">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        class="px-6 py-3 rounded-none text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300"
        :class="activeFilter === filter.value ? 'bg-white/10 text-white shadow-soft' : 'text-slate-500 hover:text-slate-300'"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Syncing history…"
      variant="dark"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Sync failed"
      variant="dark"
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
        >
          <template #cell:receiptNumber="{ value }">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ value }}</span>
          </template>

          <template #cell:amount="{ value }">
            <span class="text-sm font-black text-slate-900">{{ value }}</span>
          </template>

          <template #cell:eventTitle="{ value }">
            <span class="text-xs font-bold text-slate-600">{{ value }}</span>
          </template>

          <template #cell:issuedAt="{ value }">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ value }}</span>
          </template>

          <template #cell:status="{ row }">
            <ReceiptStatusBadge
              :status="row.status"
              class="scale-75 origin-left"
            />
          </template>

          <template #rowActions="{ row }">
            <button
              class="p-2 text-slate-400 hover:text-violet-600 transition-colors"
              @click="openReceipt(row)"
            >
              <ChevronRight class="w-5 h-5" />
            </button>
          </template>
        </DataTable>
      </div>
    </template>

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
import { useRouter } from 'vue-router'
import { useCollectorHistory } from '../composables/useCollector'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import ContributionDetailView from '@/modules/contributions/components/ContributionDetailView.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { 
  Wallet, 
  ChevronRight 
} from 'lucide-vue-next'

const router = useRouter()
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
  { key: 'eventTitle', label: 'Event/Campaign', sortable: true },
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

const dailyTotal = computed(() => {
  const receipts = query.data.value ?? []
  // In a real app, filter by today's date first
  return receipts.reduce((acc, r) => {
    const val = parseFloat(r.amount.replace(/[^0-9.]/g, ''))
    return acc + (isNaN(val) ? 0 : val)
  }, 0)
})
</script>
