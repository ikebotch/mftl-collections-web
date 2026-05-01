<template>
  <div class="min-h-screen bg-[#060B16] text-white selection:bg-violet-500/30">
    <!-- ══════════════════════════════════════════════════
         TERMINAL HEADER
    ══════════════════════════════════════════════════ -->
    <header class="px-6 pt-12 pb-10 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
      <div class="max-w-xl mx-auto space-y-2">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-1.5 bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.5)] animate-pulse" />
          <p class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">
            Financial Node Status
          </p>
        </div>
        <h1 class="text-4xl font-black text-white uppercase tracking-tight italic leading-none">
          Cash Ledger
        </h1>
        <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Operational Session · {{ todayDate }}
        </p>
      </div>
    </header>

    <main class="max-w-xl mx-auto px-6 py-10 pb-32 space-y-12">
      <!-- Cash In Hand Node -->
      <section class="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div class="absolute -inset-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 blur-xl opacity-10 group-hover:opacity-20 transition duration-1000" />
        <div class="relative bg-white/[0.03] border border-white/10 p-10 overflow-hidden">
          <p class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-6">
            Total Cash In Hand
          </p>
          
          <div class="flex flex-col gap-8">
            <h3 class="text-7xl font-black text-white tracking-tighter tabular-nums leading-none">
              {{ formatCurrency(cashInHand, 'GHS') }}
            </h3>
            
            <div class="flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Audited Live</span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mt-12 flex flex-col gap-3">
            <button
              class="
                w-full bg-emerald-600 text-white py-5
                text-xs font-black uppercase tracking-[0.2em]
                flex items-center justify-center gap-3
                shadow-[0_10px_30px_rgba(16,185,129,0.2)]
                active:scale-[0.98] transition-all
              "
              @click="isDropModalOpen = true"
            >
              <ArrowDownToLine class="w-4 h-4" />
              Record Cash Drop
            </button>
            <button
              class="
                w-full bg-white/5 border border-white/10 text-slate-400 py-5
                text-xs font-black uppercase tracking-[0.2em]
                flex items-center justify-center gap-3
                hover:bg-white/10 hover:text-white transition-all
              "
              @click="$router.push('/collector/history')"
            >
              <FileText class="w-4 h-4" />
              Operation History
            </button>
          </div>

          <!-- Decorative background icon -->
          <Banknote class="absolute -right-10 -bottom-10 w-48 h-48 text-white opacity-[0.02] pointer-events-none" />
        </div>
      </section>

      <!-- Operational Metrics -->
      <section class="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <div
          v-for="stat in summaryStats"
          :key="stat.label"
          class="bg-white/[0.03] border border-white/10 p-8 group hover:border-white/20 transition-all flex items-center justify-between"
        >
          <div class="space-y-3">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {{ stat.label }}
            </p>
            <p class="text-3xl font-black text-white uppercase tracking-tight tabular-nums">
              {{ stat.value }}
            </p>
          </div>
          <div class="h-14 w-14 bg-white/5 flex items-center justify-center text-violet-500/30 group-hover:text-violet-500 group-hover:bg-violet-500/10 transition-all">
            <component
              :is="stat.iconComp"
              class="w-6 h-6"
            />
          </div>
        </div>
      </section>

      <!-- Protocol Notice -->
      <section class="p-8 bg-violet-600/5 border border-violet-600/10 flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div class="h-14 w-14 bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-lg">
          <Info class="w-7 h-7" />
        </div>
        <div class="space-y-2">
          <h4 class="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">
            Node Protocol 44.1
          </h4>
          <p class="text-xs text-slate-400 leading-relaxed font-medium">
            Record all cash drops immediately to maintain node synchronization. 
            Unreconciled balances may delay end-of-day settlement protocol.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Banknote, Info, ArrowDownToLine, FileText, TrendingUp, Clock } from 'lucide-vue-next'
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
  return query.data.value?.profile.totalCollectedToday || 0
})

const summaryStats = computed(() => [
  { label: 'Today Revenue', value: query.data.value?.todayTotal || '₵0.00', iconComp: TrendingUp },
  { label: 'Cash Drops', value: '₵0.00', iconComp: ArrowDownToLine },
  { label: 'Pending Audit', value: '0', iconComp: Clock }
])
</script>

<style scoped>
/* Specific terminal styles */
</style>
