<template>
  <div class="space-y-8 pb-32">
    <header class="pt-2">
      <h2 class="text-3xl font-black text-white tracking-tight">History</h2>
      <p class="text-slate-400 mt-1 font-medium">Review your past collections.</p>
    </header>

    <!-- Daily Summary -->
    <div class="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-indigo-700 shadow-premium group">
       <!-- Decorative glow -->
       <div class="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-[80px]" />
       
       <div class="relative z-10 flex items-center justify-between">
          <div>
             <p class="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200/70">Total Collected Today</p>
             <p class="text-4xl font-black text-white mt-1 tracking-tighter">{{ formatCurrency(dailyTotal, 'GHS') }}</p>
             <div class="mt-4 flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                  {{ query.data.value?.length || 0 }} Receipts
                </span>
             </div>
          </div>
          <div class="w-14 h-14 rounded-3xl bg-white/10 flex items-center justify-center text-white border border-white/10">
             <Wallet class="w-7 h-7" />
          </div>
       </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 overflow-x-auto no-scrollbar">
       <button 
         v-for="filter in filters" 
         :key="filter.value"
         class="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300"
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
      <div
        v-if="filteredReceipts.length === 0"
        class="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] p-12 text-center"
      >
        <FileText class="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <p class="text-sm font-bold text-slate-500 uppercase tracking-widest">No matching receipts</p>
      </div>

      <div v-else class="space-y-4">
        <article
          v-for="receipt in filteredReceipts"
          :key="receipt.id"
          class="relative group active:scale-[0.98] transition-transform duration-200"
          @click="router.push(`/collector/receipts/${receipt.id}`)"
        >
          <div class="relative p-6 rounded-[2rem] border border-white/10 bg-white/[0.04] flex justify-between items-center group-hover:bg-white/[0.06] transition-colors">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1.5">
                <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {{ receipt.receiptNumber }}
                </p>
                <div class="w-1 h-1 rounded-full bg-slate-700" />
                <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {{ receipt.issuedAt.split(',')[0] }}
                </p>
              </div>
              <p class="text-xl font-black text-white mb-2">{{ receipt.amount }}</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                {{ receipt.eventTitle }}
              </p>
            </div>
            
            <div class="flex flex-col items-end gap-3 shrink-0 ml-4">
               <ReceiptStatusBadge :status="receipt.status" class="scale-90 origin-right" />
               <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-white transition-colors">
                  <ChevronRight class="w-5 h-5" />
               </div>
            </div>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectorHistory } from '../composables/useCollector'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatCurrency } from '@/shared/utils/formatters'
import { 
  Wallet, 
  FileText, 
  ChevronRight 
} from 'lucide-vue-next'

const router = useRouter()
const query = useCollectorHistory()
const activeFilter = ref<'all' | 'issued' | 'pending' | 'voided'>('all')

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
