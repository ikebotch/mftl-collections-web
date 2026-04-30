<template>
  <div class="min-h-screen bg-[#060B16] text-white pb-32 selection:bg-violet-500/30">
    <!-- ─── Loading / Error ─── -->
    <div v-if="query.isLoading.value" class="py-20 flex flex-col items-center">
      <LoadingState text="Accessing Node History…" class="!text-slate-400" />
    </div>
    
    <div v-else-if="query.isError.value" class="px-6 py-12">
      <ErrorState
        title="Sync Protocol Failure"
        :message="query.error.value?.message ?? 'Node connection timed out.'"
        show-retry
        class="!bg-white/5 !border-white/10"
        @retry="query.refetch"
      />
    </div>

    <div v-else class="animate-in fade-in duration-700">
      <!-- ══════════════════════════════════════════════════
           TERMINAL HEADER
      ══════════════════════════════════════════════════ -->
      <section class="px-6 pt-8 pb-10 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div class="max-w-[1400px] mx-auto">
          <div class="flex items-start justify-between gap-6">
            <div class="space-y-1.5">
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-1.5 bg-violet-500 animate-pulse" />
                <p class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">Operational Ledger</p>
              </div>
              <h1 class="text-3xl md:text-4xl font-black text-white uppercase tracking-tight italic">
                History
              </h1>
              <p class="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                All contributions recorded by this terminal
              </p>
            </div>
            
            <div class="flex items-center gap-3">
              <button
                class="h-12 w-12 flex items-center justify-center border border-white/10 hover:bg-white/5 transition-all active:scale-95"
                @click="() => query.refetch()"
              >
                <RefreshCcw class="w-5 h-5 text-slate-500 hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          <!-- Quick Metrics Grid -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-white/[0.03] border border-white/10 p-5 group hover:border-white/20 transition-all"
            >
              <div class="flex items-start justify-between mb-2">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ stat.label }}</p>
                <component :is="stat.icon" class="w-3.5 h-3.5 text-violet-500/50 group-hover:text-violet-500 transition-colors" />
              </div>
              <p class="text-2xl font-black text-white uppercase tracking-tight tabular-nums">
                {{ stat.value }}
              </p>
              <div class="h-0.5 w-8 bg-violet-600 mt-3 group-hover:w-full transition-all duration-500" />
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           MAIN WORKSPACE
      ══════════════════════════════════════════════════ -->
      <main class="max-w-[1400px] mx-auto px-6 py-12">
        
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1 border-b border-white/5 mb-8 overflow-x-auto scrollbar-none">
          <button
            v-for="filter in filters"
            :key="filter.value"
            class="
              px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative shrink-0
              hover:text-white
            "
            :class="activeFilter === filter.value ? 'text-white' : 'text-slate-500'"
            @click="activeFilter = filter.value"
          >
            {{ filter.label }}
            <div 
              v-if="activeFilter === filter.value"
              class="absolute bottom-0 inset-x-0 h-0.5 bg-violet-600 shadow-[0_0_8px_rgba(124,58,237,0.5)]"
            />
          </button>
        </div>

        <!-- Content Area -->
        <div class="space-y-6">
          
          <!-- No-records state -->
          <div v-if="!filteredReceipts.length" class="py-20 text-center bg-white/[0.02] border border-white/5">
            <FileText class="w-12 h-12 text-slate-800 mx-auto mb-6" />
            <h4 class="text-lg font-black text-white uppercase tracking-tight mb-2">No Records Found</h4>
            <p class="text-sm text-slate-500 max-w-xs mx-auto">No collections matching the selected filter were found on this terminal.</p>
          </div>

          <!-- Phone: Card List -->
          <div class="md:hidden space-y-3">
            <button
              v-for="receipt in filteredReceipts"
              :key="receipt.id"
              class="
                w-full bg-white/[0.02] border border-white/5 p-4
                flex items-center justify-between gap-4
                hover:bg-white/[0.04] hover:border-white/10 transition-all text-left group
              "
              @click="openReceipt(receipt)"
            >
              <div class="flex items-center gap-4 min-w-0">
                <div class="h-10 w-10 bg-white/5 flex items-center justify-center shrink-0">
                  <ReceiptIcon class="w-5 h-5 text-slate-700 group-hover:text-violet-500/50 transition-colors" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-black text-white uppercase tracking-tight truncate">{{ receipt.contributorName || 'Anonymous' }}</p>
                  <p class="text-[10px] font-bold text-slate-500 uppercase truncate mt-0.5">
                    {{ receipt.eventTitle }} · {{ receipt.paymentMethod }}
                  </p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-black text-white tracking-tight tabular-nums">{{ receipt.amount }}</p>
                <div class="flex justify-end mt-1">
                  <div 
                    class="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 border"
                    :class="getStatusClasses(receipt.status)"
                  >
                    {{ receipt.status }}
                  </div>
                </div>
              </div>
            </button>
          </div>

          <!-- Tablet / Desktop: Data Table -->
          <div class="hidden md:block bg-white/[0.02] border border-white/10 overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/10 bg-white/[0.02]">
                  <th v-for="col in columns" :key="col.key" class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {{ col.label }}
                  </th>
                  <th class="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr 
                  v-for="receipt in filteredReceipts" 
                  :key="receipt.id"
                  class="hover:bg-white/[0.02] transition-all cursor-pointer group"
                  @click="openReceipt(receipt)"
                >
                  <td class="px-6 py-5">
                    <span class="text-xs font-bold text-slate-400">{{ receipt.issuedAt }}</span>
                  </td>
                  <td class="px-6 py-5">
                    <span class="text-[10px] font-black text-violet-400 uppercase tracking-widest">{{ receipt.receiptNumber }}</span>
                  </td>
                  <td class="px-6 py-5">
                    <span class="text-sm font-black text-white uppercase tracking-tight">{{ receipt.contributorName || 'Anonymous' }}</span>
                  </td>
                  <td class="px-6 py-5">
                    <span class="text-xs font-bold text-slate-500 truncate max-w-[200px] block">{{ receipt.eventTitle }}</span>
                  </td>
                  <td class="px-6 py-5">
                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ receipt.paymentMethod }}</span>
                  </td>
                  <td class="px-6 py-5">
                    <span class="text-sm font-black text-white tabular-nums">{{ receipt.amount }}</span>
                  </td>
                  <td class="px-6 py-5">
                    <div 
                      class="inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border"
                      :class="getStatusClasses(receipt.status)"
                    >
                      {{ receipt.status }}
                    </div>
                  </td>
                  <td class="px-6 py-5 text-right">
                    <ChevronRight class="w-4 h-4 text-slate-700 group-hover:text-white transition-colors ml-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- Detail Drawer -->
      <DetailDrawer
        :is-open="isDrawerOpen"
        title="Operational Receipt"
        :subtitle="selectedReceipt?.receiptNumber"
        @close="isDrawerOpen = false"
        class="terminal-drawer"
      >
        <ContributionDetailView v-if="selectedReceipt" :contribution="selectedReceipt" />
      </DetailDrawer>

      <!-- Mobile Sticky CTA -->
      <div class="md:hidden fixed bottom-0 inset-x-0 bg-[#060B16] border-t border-white/5 px-6 py-4 safe-area-bottom z-40">
        <button
          class="
            w-full bg-violet-600 text-white py-4
            text-xs font-black uppercase tracking-[0.2em]
            flex items-center justify-center gap-3
            shadow-[0_10px_30px_rgba(124,58,237,0.3)]
            active:scale-[0.98] transition-all
          "
          @click="$router.push('/collector/contributions/new')"
        >
          <Plus class="w-4 h-4" />
          Record New Collection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCollectorHistory } from '../composables/useCollector'
import { formatCurrency } from '@/core/formatting/formatters'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import ContributionDetailView from '@/modules/contributions/components/ContributionDetailView.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { 
  ChevronRight, FileText, Plus, RefreshCcw, 
  TrendingUp, CheckCircle, Clock, Receipt as ReceiptIcon 
} from 'lucide-vue-next'

const query = useCollectorHistory()
const activeFilter = ref<'all' | 'issued' | 'pending' | 'voided'>('all')
const isDrawerOpen = ref(false)
const selectedReceipt = ref<any>(null)

function openReceipt(receipt: any) {
  selectedReceipt.value = receipt
  isDrawerOpen.value = true
}

const columns = [
  { key: 'issuedAt', label: 'Date' },
  { key: 'receiptNumber', label: 'Receipt #' },
  { key: 'contributorName', label: 'Contributor' },
  { key: 'eventTitle', label: 'Event' },
  { key: 'paymentMethod', label: 'Method' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

const filters = [
  { label: 'All Operations', value: 'all' as const },
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

function getStatusClasses(status: string) {
  const s = status.toLowerCase()
  if (s === 'issued') return 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
  if (s === 'pending') return 'border-amber-500/20 text-amber-500 bg-amber-500/5'
  if (s === 'voided') return 'border-rose-500/20 text-rose-500 bg-rose-500/5'
  return 'border-slate-500/20 text-slate-500 bg-slate-500/5'
}

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
    } catch { /* skip */ }
  }
  return formatCurrency(total, currency)
})

const stats = computed(() => {
  return [
    { label: 'Today Revenue', value: todayTotalFormatted.value, icon: TrendingUp },
    { label: 'Total Volume', value: String(filteredReceipts.value.length), icon: FileText },
    { label: 'Finalized', value: String(countByStatus('issued')), icon: CheckCircle },
    { label: 'Pending Sync', value: String(countByStatus('pending')), icon: Clock },
  ]
})
</script>

<style scoped>
.terminal-drawer :deep(.bg-white) {
  background-color: #060B16 !important;
  color: white !important;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
