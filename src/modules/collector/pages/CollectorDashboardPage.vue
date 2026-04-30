<template>
  <div class="min-h-screen bg-[#060B16] text-white pb-32 selection:bg-violet-500/30">
    <!-- ─── Loading / Error ─── -->
    <div v-if="query.isLoading.value" class="py-20 flex flex-col items-center">
      <LoadingState text="Accessing Terminal Hub…" class="!text-slate-400" />
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

    <div v-else-if="query.data.value" class="animate-in fade-in duration-700">
      <!-- ══════════════════════════════════════════════════
           TERMINAL HEADER
      ══════════════════════════════════════════════════ -->
      <section class="px-6 pt-8 pb-10 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div class="max-w-[1400px] mx-auto">
          <div class="flex items-start justify-between gap-6">
            <div class="space-y-1.5">
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-1.5 bg-violet-500 animate-pulse" />
                <p class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">Operational Session Active</p>
              </div>
              <h1 class="text-3xl md:text-4xl font-black text-white uppercase tracking-tight italic">
                Welcome, {{ query.data.value.profile.name.split(' ')[0] }}
              </h1>
              <p class="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                {{ query.data.value.currentShiftLabel || 'Station 01 / Accra Main' }}
              </p>
            </div>
            
            <div class="flex items-center gap-3">
              <button
                class="h-12 w-12 flex items-center justify-center border border-white/10 hover:bg-white/5 transition-all active:scale-95"
                @click="() => query.refetch()"
              >
                <RefreshCcw class="w-5 h-5 text-slate-500 hover:text-white transition-colors" />
              </button>
              <button
                class="
                  hidden md:flex h-12 px-6 items-center gap-3
                  bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest
                  shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]
                  transition-all active:scale-[0.98]
                "
                @click="$router.push('/collector/contributions/new')"
              >
                <Plus class="w-4 h-4" />
                Record Collection
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
        <div class="xl:grid xl:grid-cols-12 xl:gap-12 items-start">
          
          <!-- LEFT: ASSIGNMENTS -->
          <div class="xl:col-span-8 space-y-8">
            <div class="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Active Assignments</h3>
                <p class="text-[11px] text-slate-400 font-bold uppercase mt-1">Campaigns under your supervision</p>
              </div>
              <button 
                class="flex items-center gap-2 px-3 py-1.5 border border-white/5 hover:bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all"
                @click="showFigures = !showFigures"
              >
                <component :is="showFigures ? Eye : EyeOff" class="w-3.5 h-3.5" />
                {{ showFigures ? 'Mask Figures' : 'Show Figures' }}
              </button>
            </div>

            <!-- No-assignments state -->
            <div v-if="!query.data.value.profile.hasAssignments">
              <div class="bg-white/[0.02] border border-white/5 p-16 text-center">
                <Calendar class="w-12 h-12 text-slate-800 mx-auto mb-6" />
                <h4 class="text-lg font-black text-white uppercase tracking-tight mb-2">No Active Assignments</h4>
                <p class="text-sm text-slate-500 max-w-xs mx-auto">Contact your administrator to be assigned to an event hub.</p>
              </div>
            </div>

            <!-- Assignments Loop -->
            <div v-else class="space-y-6">
              <div
                v-for="event in query.data.value.assignments.events"
                :key="event.id"
                class="bg-white/[0.02] border border-white/10 group overflow-hidden"
              >
                <!-- Event Strip -->
                <div class="px-6 py-5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="h-10 w-10 bg-white/5 border border-white/10 flex items-center justify-center">
                      <Target class="w-5 h-5 text-violet-500/50" />
                    </div>
                    <div>
                      <h3 class="text-sm font-black text-white uppercase tracking-tight">{{ event.title }}</h3>
                      <div class="flex items-center gap-3 mt-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span class="flex items-center gap-1"><MapPin class="w-3 h-3" /> {{ event.location || 'Accra Hub' }}</span>
                        <span class="h-1 w-1 bg-slate-700 rounded-full" />
                        <span>{{ event.dateLabel }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <span class="text-[9px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-0.5 bg-emerald-500/5">
                      LIVE
                    </span>
                  </div>
                </div>

                <!-- Fund Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                  <button
                    v-for="fund in fundsForEvent(event.id)"
                    :key="fund.id"
                    class="
                      bg-[#060B16] px-6 py-6 text-left
                      hover:bg-white/[0.03] transition-all relative overflow-hidden group/fund
                    "
                    @click="navigateToCollect(event, fund)"
                  >
                    <!-- Background Accent -->
                    <div class="absolute top-0 right-0 p-1 opacity-0 group-hover/fund:opacity-100 transition-opacity">
                      <ArrowRight class="w-4 h-4 text-violet-500" />
                    </div>

                    <div class="flex items-start justify-between mb-4">
                      <div>
                        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{{ fund.name }}</p>
                        <h4 class="text-xl font-black text-white tracking-tighter tabular-nums">
                          {{ showFigures ? formatCurrency(fund.collectedAmount, fund.currency) : '••••••' }}
                        </h4>
                      </div>
                      <div class="h-8 w-8 bg-white/5 flex items-center justify-center">
                        <Wallet class="w-4 h-4 text-slate-600 group-hover/fund:text-violet-400 transition-colors" />
                      </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="space-y-1.5">
                      <div class="flex justify-between text-[9px] font-black uppercase tracking-widest">
                        <span class="text-slate-500">Fund Progress</span>
                        <span class="text-white">{{ fund.progress }}%</span>
                      </div>
                      <div class="h-1 bg-white/5">
                        <div 
                          class="h-full bg-violet-600 transition-all duration-1000 shadow-[0_0_8px_rgba(124,58,237,0.5)]" 
                          :style="{ width: `${fund.progress}%` }" 
                        />
                      </div>
                    </div>
                  </button>
                </div>

                <!-- Currency Breakdown (Collapsible) -->
                <div v-if="eventCurrencyTotals(event.id).length > 1" class="border-t border-white/5">
                  <button
                    class="w-full px-6 py-3 flex items-center justify-between hover:bg-white/5 transition-all"
                    @click="toggleEventExpand(event.id)"
                  >
                    <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Currency Breakdown</span>
                    <ChevronDown
                      class="w-3.5 h-3.5 text-slate-600 transition-transform duration-500"
                      :class="{ 'rotate-180': expandedEvents.has(event.id) }"
                    />
                  </button>
                  <div v-if="expandedEvents.has(event.id)" class="bg-white/[0.01] grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 animate-in slide-in-from-top-2 duration-300">
                    <div
                      v-for="total in eventCurrencyTotals(event.id)"
                      :key="total.currency"
                      class="bg-[#060B16] px-6 py-4"
                    >
                      <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">{{ total.label || total.currency }}</p>
                      <p class="text-sm font-black text-white uppercase tracking-tight mt-1 tabular-nums">
                        {{ showFigures ? formatCurrency(total.total, total.currency) : '•••' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: RECENT ACTIVITY -->
          <div class="xl:col-span-4 mt-12 xl:mt-0 space-y-8">
            <div class="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Node History</h3>
                <p class="text-[11px] text-slate-400 font-bold uppercase mt-1">Recent processed receipts</p>
              </div>
              <router-link 
                to="/collector/history" 
                class="text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-white transition-colors"
              >
                Full Ledger
              </router-link>
            </div>

            <div class="space-y-3">
              <button
                v-for="receipt in query.data.value.recentReceipts"
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
                    <Receipt class="w-5 h-5 text-slate-700 group-hover:text-violet-500/50 transition-colors" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-black text-white uppercase tracking-tight truncate">{{ receipt.contributorName || 'Anonymous' }}</p>
                    <p class="text-[10px] font-bold text-slate-500 uppercase truncate mt-0.5">{{ receipt.eventTitle }}</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-black text-white tracking-tight tabular-nums">{{ receipt.amount }}</p>
                  <p class="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 opacity-60">Verified</p>
                </div>
              </button>

              <div v-if="!query.data.value.recentReceipts.length" class="py-12 text-center">
                <p class="text-xs font-bold text-slate-600 uppercase tracking-widest">No Recent Operations</p>
              </div>
            </div>

            <!-- Terminal Support Info -->
            <div class="bg-violet-600/5 border border-violet-500/10 p-6">
              <div class="flex items-center gap-3 mb-3">
                <ShieldCheck class="w-4 h-4 text-violet-400" />
                <span class="text-[10px] font-black text-violet-400 uppercase tracking-widest">Secure Terminal Info</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed italic">
                All collections are end-to-end encrypted and synced in real-time with the central hub authority. Ensure your terminal ID is kept confidential.
              </p>
            </div>
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectorDashboard } from '../composables/useCollector'
import { formatCurrency } from '@/core/formatting/formatters'
import type { CollectorAssignedEvent, CollectorAssignedFund } from '../types/collector'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import ContributionDetailView from '@/modules/contributions/components/ContributionDetailView.vue'
import { 
  Plus, RefreshCcw, Eye, EyeOff, Wallet, 
  ChevronDown, ArrowRight, Receipt, Target,
  MapPin, Calendar, TrendingUp, FileText, ShieldCheck
} from 'lucide-vue-next'

const router = useRouter()
const query = useCollectorDashboard()

const isDrawerOpen = ref(false)
const selectedReceipt = ref<any>(null)
const showFigures = ref(true)
const expandedEvents = ref(new Set<string>())

function toggleEventExpand(eventId: string) {
  expandedEvents.value.has(eventId) ? expandedEvents.value.delete(eventId) : expandedEvents.value.add(eventId)
  expandedEvents.value = new Set(expandedEvents.value)
}

function fundsForEvent(eventId: string): CollectorAssignedFund[] {
  return (query.data.value?.assignments.funds ?? []).filter(f => f.eventId === eventId)
}

function eventCurrencyTotals(eventId: string) {
  const byCode: Record<string, { currency: string; total: number; label: string }> = {}
  for (const fund of fundsForEvent(eventId)) {
    if (!byCode[fund.currency]) byCode[fund.currency] = { currency: fund.currency, total: 0, label: fund.currency }
    byCode[fund.currency].total += fund.collectedAmount
  }
  return Object.values(byCode)
}

function navigateToCollect(event: CollectorAssignedEvent, fund: CollectorAssignedFund) {
  router.push(`/collector/contributions/new?eventId=${event.id}&fundId=${fund.id}`)
}

function openReceipt(receipt: any) {
  selectedReceipt.value = receipt
  isDrawerOpen.value = true
}

const stats = computed(() => {
  if (!query.data.value) return []
  const { profile } = query.data.value
  return [
    { label: 'Today Total', value: showFigures.value ? query.data.value.todayTotal : '••••••', icon: TrendingUp },
    { label: 'Receipts Issued', value: String(profile.receiptsIssuedToday), icon: FileText },
    { label: 'Events Active', value: String(profile.assignedEventCount), icon: Calendar },
    { label: 'Funds Managed', value: String(profile.assignedFundCount), icon: Wallet },
  ]
})

onMounted(() => {
  const first = query.data.value?.assignments.events[0]
  if (first) expandedEvents.value.add(first.id)
})
</script>

<style scoped>
.terminal-drawer :deep(.bg-white) {
  background-color: #060B16 !important;
  color: white !important;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
