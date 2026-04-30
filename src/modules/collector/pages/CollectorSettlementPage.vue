<template>
  <div class="min-h-screen bg-[#060B16] text-white pb-32 selection:bg-violet-500/30">
    <!-- ─── Loading / Error ─── -->
    <div v-if="query.isLoading.value" class="py-20 flex flex-col items-center">
      <LoadingState text="Accessing Node Settlements…" class="!text-slate-400" />
    </div>
    
    <div v-else-if="query.isError.value" class="px-6 py-12">
      <ErrorState
        title="Protocol Sync Failure"
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
      <section class="px-6 pt-12 pb-10 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div class="max-w-[1400px] mx-auto">
          <div class="flex items-start justify-between gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-1.5 bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.5)] animate-pulse" />
                <p class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">Operational Settlements</p>
              </div>
              <h1 class="text-4xl font-black text-white uppercase tracking-tight italic leading-none">
                Settlements
              </h1>
              <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Cash reconciliation and field agent handovers
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
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-white/[0.03] border border-white/10 p-6 group hover:border-white/20 transition-all flex items-center justify-between"
            >
              <div class="space-y-2">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{{ stat.label }}</p>
                <p class="text-2xl font-black text-white uppercase tracking-tight tabular-nums">
                  {{ stat.value }}
                </p>
              </div>
              <component :is="stat.icon" class="w-5 h-5 text-violet-500/30 group-hover:text-violet-500 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           MAIN WORKSPACE
      ══════════════════════════════════════════════════ -->
      <main class="max-w-[1400px] mx-auto px-6 py-12">
        
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1 border-b border-white/5 mb-10 overflow-x-auto scrollbar-none">
          <button
            v-for="filter in filters"
            :key="filter.value"
            class="
              px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative shrink-0
              hover:text-white
            "
            :class="activeFilter === filter.value ? 'text-white' : 'text-slate-500'"
            @click="activeFilter = filter.value"
          >
            {{ filter.label }}
            <div 
              v-if="activeFilter === filter.value"
              class="absolute bottom-0 inset-x-0 h-0.5 bg-violet-600 shadow-[0_0_12px_rgba(124,58,237,0.5)]"
            />
          </button>
        </div>

        <!-- Content Area -->
        <div class="space-y-6">
          
          <!-- No-records state -->
          <div v-if="!filteredSettlements.length" class="py-24 text-center bg-white/[0.02] border border-white/5 animate-in fade-in duration-500">
            <FileX2 class="w-16 h-16 text-slate-800 mx-auto mb-8" />
            <h4 class="text-xl font-black text-white uppercase tracking-tight mb-2">No Settlement Data</h4>
            <p class="text-sm text-slate-500 max-w-xs mx-auto font-medium uppercase tracking-wide opacity-60">No reconciliation records matching the selected protocol were found on this node.</p>
          </div>

          <!-- Phone: Card List -->
          <div class="md:hidden space-y-4">
            <div
              v-for="settlement in filteredSettlements"
              :key="settlement.id"
              class="
                w-full bg-white/[0.02] border border-white/10 p-6
                flex items-center justify-between gap-6
                hover:bg-white/[0.04] hover:border-white/20 transition-all text-left group
              "
            >
              <div class="flex items-center gap-5 min-w-0">
                <div class="h-14 w-14 bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                  <Wallet class="w-6 h-6 text-slate-700 group-hover:text-violet-500/50 transition-colors" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-black text-white uppercase tracking-tight truncate leading-none mb-1.5">{{ settlement.date }}</p>
                  <div class="flex items-center gap-2 overflow-hidden">
                    <p class="text-[10px] font-black text-slate-500 uppercase truncate tracking-widest">{{ settlement.collectorName }}</p>
                    <span class="h-1 w-1 bg-slate-800 rounded-full shrink-0" />
                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{{ settlement.note || 'Regular Handover' }}</p>
                  </div>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xl font-black text-white tracking-tighter tabular-nums leading-none">{{ settlement.amount }}</p>
                <div class="flex justify-end mt-2">
                  <div 
                    class="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border"
                    :class="getStatusClasses(settlement.status)"
                  >
                    {{ settlement.status }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tablet / Desktop: Data Table -->
          <div class="hidden md:block bg-white/[0.02] border border-white/10 overflow-hidden shadow-2xl">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/10 bg-white/[0.03]">
                  <th v-for="col in columns" :key="col.key" class="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr 
                  v-for="settlement in filteredSettlements" 
                  :key="settlement.id"
                  class="hover:bg-white/[0.03] transition-all group"
                >
                  <td class="px-8 py-6">
                    <span class="text-xs font-black text-slate-500 uppercase tracking-widest">{{ settlement.date }}</span>
                  </td>
                  <td class="px-8 py-6">
                    <span class="text-sm font-black text-white uppercase tracking-tight">{{ settlement.collectorName }}</span>
                  </td>
                  <td class="px-8 py-6">
                    <span class="text-xs font-black text-slate-500 truncate max-w-[200px] block uppercase tracking-wide">{{ settlement.note || 'Terminal Handover' }}</span>
                  </td>
                  <td class="px-8 py-6">
                    <span class="text-sm font-black text-white tabular-nums tracking-tighter">{{ settlement.amount }}</span>
                  </td>
                  <td class="px-8 py-6">
                    <div 
                      class="inline-block text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 border"
                      :class="getStatusClasses(settlement.status)"
                    >
                      {{ settlement.status }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- Mobile Sticky CTA -->
      <div class="md:hidden fixed bottom-0 inset-x-0 bg-[#060B16] border-t border-white/5 px-6 py-6 safe-area-bottom z-40">
        <button
          class="
            w-full bg-violet-600 text-white py-5
            text-xs font-black uppercase tracking-[0.3em]
            flex items-center justify-center gap-3
            shadow-[0_15px_40px_rgba(124,58,237,0.3)]
            active:scale-[0.98] transition-all
          "
          @click="() => query.refetch()"
        >
          <RefreshCcw class="w-4 h-4" />
          Sync Operational State
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCollectorSettlements } from '../composables/useCollector'
import { formatCurrency } from '@/core/formatting/formatters'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { 
  RefreshCcw, Wallet, CheckCircle, Clock, 
  TrendingDown, FileX2, ShieldCheck
} from 'lucide-vue-next'

const query = useCollectorSettlements()
const activeFilter = ref<'all' | 'completed' | 'pending' | 'review'>('all')

const columns = [
  { key: 'date', label: 'Protocol Date' },
  { key: 'collectorName', label: 'Node Agent' },
  { key: 'note', label: 'Reference' },
  { key: 'amount', label: 'Value' },
  { key: 'status', label: 'Status' },
]

const filters = [
  { label: 'All Protocols', value: 'all' as const },
  { label: 'Completed', value: 'completed' as const },
  { label: 'Awaiting Audit', value: 'pending' as const },
  { label: 'In Review', value: 'review' as const },
]

const filteredSettlements = computed(() => {
  const list = query.data.value ?? []
  if (activeFilter.value === 'all') return list
  return list.filter(s => s.status.toLowerCase().includes(activeFilter.value))
})

function countByStatus(status: string) {
  return (query.data.value ?? []).filter(s => s.status.toLowerCase().includes(status)).length
}

function getStatusClasses(status: string) {
  const s = status.toLowerCase()
  if (s.includes('completed') || s.includes('success')) return 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
  if (s.includes('pending') || s.includes('awaiting')) return 'border-amber-500/20 text-amber-500 bg-amber-500/5'
  if (s.includes('review')) return 'border-violet-500/20 text-violet-500 bg-violet-500/5'
  return 'border-slate-500/20 text-slate-500 bg-slate-500/5'
}

const stats = computed(() => {
  const list = query.data.value ?? []
  const pendingTotal = list.filter(s => !s.status.toLowerCase().includes('completed')).reduce((acc, s) => acc + s.amountValue, 0)
  const currency = list[0]?.currency || 'GHS'

  return [
    { label: 'Pending Audit', value: formatCurrency(pendingTotal, currency), icon: TrendingDown },
    { label: 'Node Records', value: String(list.length), icon: ShieldCheck },
    { label: 'Completed', value: String(countByStatus('completed')), icon: CheckCircle },
    { label: 'Awaiting', value: String(countByStatus('awaiting')), icon: Clock },
  ]
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Mobile Ergonomics */
.safe-area-bottom {
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
}
</style>
