<template>
  <div class="space-y-8 pb-20">
    <!-- Header -->
    <header class="flex flex-col gap-2">
      <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
        Financial Status
      </p>
      <h2 class="text-3xl lg:text-5xl font-black tracking-tight uppercase italic text-slate-900">
        Cash Ledger
      </h2>
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        Active Session · {{ todayDate }}
      </p>
    </header>

    <!-- Cash In Hand Card -->
    <section class="bg-slate-900 p-8 lg:p-12 text-white border-l-8 border-emerald-500 shadow-2xl relative overflow-hidden">
      <div class="relative z-10">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          Total Cash In Hand
        </p>
        <div class="mt-6 flex flex-col lg:flex-row lg:items-baseline gap-4 lg:gap-8">
          <h3 class="text-6xl lg:text-8xl font-black tracking-tighter">
            {{ formatCurrency(cashInHand, 'GHS') }}
          </h3>
          <div class="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 w-fit">
            <div class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span class="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Audited Live</span>
          </div>
        </div>
        
        <div class="mt-12 flex flex-wrap gap-4">
          <AppButton
            variant="primary"
            class="!bg-emerald-600 hover:!bg-emerald-500 !text-white !rounded-none !px-8 !py-6 text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20"
            @click="isDropModalOpen = true"
          >
            Record Cash Drop
          </AppButton>
          <AppButton
            variant="ghost"
            class="!text-slate-400 hover:!text-white !border-slate-800 !rounded-none !px-8 !py-6 text-xs font-black uppercase tracking-widest"
            @click="$router.push('/collector/history')"
          >
            History
          </AppButton>
        </div>
      </div>
      
      <!-- Decorative element -->
      <div class="absolute -right-20 -bottom-20 opacity-10">
        <Banknote class="w-80 h-80 text-white" />
      </div>
    </section>

    <!-- Stats Grid -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <MetricCard 
        v-for="(stat, index) in summaryStats" 
        :key="index"
        v-bind="stat"
        class="shadow-sm hover:shadow-premium transition-all duration-500"
      />
    </section>

    <!-- Recent Drops Table -->
    <section class="space-y-6">
      <div class="flex items-center justify-between border-b border-slate-200 pb-6">
        <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
          Recent Cash Drops
        </h3>
      </div>
      
      <div class="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          :columns="dropColumns"
          :rows="[]"
          :loading="false"
          title="Drop History"
        >
          <template #cell:status="{ value }">
            <span class="px-2 py-1 bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">
              {{ value || 'Pending' }}
            </span>
          </template>
        </DataTable>
      </div>
    </section>

    <!-- Info Box -->
    <section class="p-6 bg-violet-50 border border-violet-100 flex gap-6">
      <div class="h-12 w-12 bg-violet-600 text-white flex items-center justify-center shrink-0">
        <Info class="w-6 h-6" />
      </div>
      <div class="space-y-1">
        <h4 class="text-[11px] font-black uppercase tracking-widest text-violet-900">
          Important Note
        </h4>
        <p class="text-xs text-violet-700 leading-relaxed">
          Please ensure all cash drops are recorded immediately to maintain accurate terminal balances. 
          Unreconciled balances may delay your end-of-day settlement.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Banknote, Info } from 'lucide-vue-next'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { useCollectorDashboard } from '../composables/useCollector'

const query = useCollectorDashboard()
const isDropModalOpen = ref(false)

const todayDate = computed(() => {
  return new Intl.DateTimeFormat('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date())
})

const cashInHand = computed(() => {
  // Mocking for now, in a real app this would come from a specific ledger query
  return query.data.value?.profile.totalCollectedToday || 0
})

const summaryStats = computed(() => [
  { label: 'Today Collections', value: query.data.value?.todayTotal || '₵0.00', icon: 'TrendingUp', color: 'green' as const },
  { label: 'Total Cash Drops', value: '₵0.00', icon: 'ArrowDownToLine', color: 'purple' as const },
  { label: 'Pending Drops', value: '0', icon: 'Clock', color: 'amber' as const }
])

const dropColumns = [
  { key: 'timestamp', label: 'Time', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'reference', label: 'Reference', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]
</script>
