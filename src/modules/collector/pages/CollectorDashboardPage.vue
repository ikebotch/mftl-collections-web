<template>
  <div class="space-y-10 pb-20 transition-colors duration-500">
    <LoadingState
      v-if="query.isLoading.value"
      text="Connecting to terminal..."
      :variant="isDesktop ? 'light' : 'dark'"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Terminal offline"
      :message="query.error.value?.message ?? 'Check your connection.'"
      :variant="isDesktop ? 'light' : 'dark'"
      show-retry
      @retry="query.refetch"
    />
    <template v-else-if="query.data.value">
      <!-- Scenic Hero (Mobile/Web Hybrid) -->
      <section class="relative h-[250px] lg:h-[350px] -mx-5 lg:-mx-16 -mt-10 lg:-mt-16 mb-12 overflow-hidden shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000" 
          class="w-full h-full object-cover"
          alt="Scenic Background"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20" />
        
        <div class="absolute bottom-8 left-0 right-0 px-8 flex flex-col gap-6">
          <div class="flex items-end justify-between">
            <div class="space-y-1">
              <p class="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
                Terminal Alpha / Ready
              </p>
              <h2 class="text-4xl lg:text-6xl font-black text-white uppercase italic tracking-tight">
                Hi, {{ query.data.value.profile.name }}
              </h2>
            </div>
            <div class="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20">
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span class="text-[9px] font-black text-white uppercase tracking-widest">Live Sync Active</span>
            </div>
          </div>

          <!-- Circular Quick Actions (Desktop/Mobile) -->
          <div class="flex items-center gap-6 lg:gap-12">
            <button 
              class="flex flex-col items-center gap-3 group"
              @click="$router.push('/collector/contributions/new')"
            >
              <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center text-violet-600 shadow-xl group-hover:scale-110 transition-transform">
                <Plus class="w-6 h-6" />
              </div>
              <span class="text-[10px] font-black text-white uppercase tracking-widest">Collect</span>
            </button>
            <button 
              class="flex flex-col items-center gap-3 group"
              @click="$router.push('/collector/history')"
            >
              <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center text-violet-600 shadow-xl group-hover:scale-110 transition-transform">
                <FileText class="w-6 h-6" />
              </div>
              <span class="text-[10px] font-black text-white uppercase tracking-widest">History</span>
            </button>
            <button 
              class="flex flex-col items-center gap-3 group"
              @click="query.refetch"
            >
              <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center text-violet-600 shadow-xl group-hover:scale-110 transition-transform">
                <RefreshCcw class="w-6 h-6" />
              </div>
              <span class="text-[10px] font-black text-white uppercase tracking-widest">Sync</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Summary Section -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <MetricCard 
          v-for="(stat, index) in stats" 
          :key="index"
          v-bind="stat"
          class="shadow-sm hover:shadow-premium transition-all duration-500"
        />
      </section>

      <div class="grid lg:grid-cols-12 gap-12 items-start">
        <!-- Products Section -->
        <div class="lg:col-span-8 space-y-10">
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-black uppercase italic text-slate-900">
                Your products
              </h3>
              <div class="h-px flex-1 bg-slate-200 mx-6 hidden lg:block" />
              <button 
                class="p-2 transition-colors"
                :class="showFigures ? 'text-violet-600' : 'text-slate-400'"
                @click.stop="showFigures = !showFigures"
              >
                <component
                  :is="showFigures ? Eye : EyeOff"
                  class="w-5 h-5"
                />
              </button>
            </div>

            <div
              v-if="!query.data.value.profile.hasAssignments"
              class="p-16 border border-dashed border-slate-300 text-center flex flex-col items-center gap-4"
            >
              <LayoutGrid class="w-12 h-12 text-slate-200" />
              <p class="text-xs font-black uppercase tracking-widest text-slate-400">
                No active assignments found
              </p>
            </div>

            <div
              v-else
              class="grid gap-4"
            >
              <article 
                v-for="(event, idx) in query.data.value.assignments.events" 
                :key="event.id"
                class="bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                @click="$router.push(`/collector/contributions/new?eventId=${event.id}`)"
              >
                <div class="p-8">
                  <div class="flex items-center justify-between mb-8">
                    <div class="w-10 h-10 bg-violet-600 flex items-center justify-center text-white">
                      <Wallet class="w-5 h-5" />
                    </div>
                    <div class="flex items-center gap-4">
                      <Star class="w-5 h-5 text-slate-300 group-hover:text-amber-400 transition-colors" />
                      <MoreVertical class="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                  
                  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h4 class="text-lg font-black uppercase italic text-slate-900">
                        {{ event.title }}
                      </h4>
                      <p class="text-sm font-bold text-slate-500 mt-1">
                        {{ event.location || 'Active Terminal' }} · {{ event.dateLabel }}
                      </p>
                      <p class="text-[10px] font-black uppercase tracking-widest text-violet-600 mt-4">
                        {{ event.assignedFundCount }} Active Funds
                      </p>
                    </div>
                    
                    <div class="text-right">
                      <p class="text-3xl font-black text-slate-900 tracking-tighter">
                        ₵{{ (Math.random() * 5000).toFixed(2) }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="border-t border-slate-100">
                  <button 
                    class="w-full px-8 py-4 flex items-center justify-between group/row hover:bg-slate-50 transition-colors"
                    @click.stop="isBalancesExpanded = !isBalancesExpanded"
                  >
                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Currency balances</span>
                    <ChevronDown 
                      class="w-4 h-4 text-slate-400 transition-transform duration-300"
                      :class="{ 'rotate-180': isBalancesExpanded }"
                    />
                  </button>
                  
                  <div 
                    v-if="isBalancesExpanded"
                    class="bg-slate-50/50"
                  >
                    <div 
                      v-for="total in query.data.value.profile.totalsPerCurrency" 
                      :key="total.currency"
                      class="px-10 py-5 border-t border-slate-100 flex items-center justify-between group/item hover:bg-white transition-all"
                    >
                      <div class="flex flex-col">
                        <span class="text-xs font-black text-slate-900 uppercase italic">{{ total.label }}</span>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ total.currency }} Terminal</span>
                      </div>
                      <p class="text-sm font-black text-slate-900 tracking-tight">
                        {{ showFigures ? formatCurrency(total.total, total.currency) : '***' }}
                      </p>
                    </div>
                  </div>

                  <button 
                    class="w-full px-8 py-4 border-t border-slate-100 flex items-center justify-between group/row hover:bg-slate-50 transition-colors"
                    @click.stop="isMoreExpanded = !isMoreExpanded"
                  >
                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">More currencies</span>
                    <ChevronDown 
                      class="w-4 h-4 text-slate-400 transition-transform duration-300"
                      :class="{ 'rotate-180': isMoreExpanded }"
                    />
                  </button>
                  <div
                    v-if="isMoreExpanded"
                    class="p-8 text-center bg-slate-50/30"
                  >
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Additional currencies available via FX Terminal
                    </p>
                  </div>
                </div>
              </article>
            </div>
            
            <div class="p-8 border border-dashed border-slate-300 flex items-center gap-6 hover:border-violet-500 transition-colors cursor-pointer group">
              <div class="w-12 h-12 border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-violet-600 group-hover:border-violet-100 transition-all">
                <Building2 class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <h5 class="text-sm font-black uppercase italic text-slate-900">
                  Connect a non-MFTL account
                </h5>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  View your balances with other banks.
                </p>
              </div>
              <Plus class="w-6 h-6 text-slate-300 group-hover:text-violet-600" />
            </div>
          </section>
        </div>

        <!-- Activity Sidebar -->
        <div class="lg:col-span-4 space-y-8">
          <section class="space-y-6">
            <div class="flex items-center justify-between border-b border-slate-200 pb-6">
              <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                Recent activity
              </h3>
              <router-link
                to="/collector/history"
                class="text-[10px] font-black uppercase text-violet-600 underline underline-offset-4"
              >
                Full history
              </router-link>
            </div>

            <div class="space-y-2">
              <div
                v-for="receipt in query.data.value.recentReceipts"
                :key="receipt.id"
                class="p-4 border-b border-slate-100 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                @click="openReceipt(receipt)"
              >
                <div class="flex items-center gap-4 min-w-0">
                  <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <Wallet class="w-5 h-5" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-black text-slate-900 uppercase truncate">
                      INTERNET TRANSFER
                    </p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {{ receipt.receiptNumber.split('-').pop() }} · {{ receipt.issuedAt.split(',')[1]?.trim() }}
                    </p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-black text-slate-900">
                    - {{ receipt.amount }}
                  </p>
                  <p class="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                    TFR
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCollectorDashboard } from '../composables/useCollector'
import { formatCurrency } from '@/core/formatting/formatters'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import ContributionDetailView from '@/modules/contributions/components/ContributionDetailView.vue'
import { 
  Plus, 
  FileText, 
  RefreshCcw, 
  Eye, 
  EyeOff,
  Wallet, 
  Star, 
  MoreVertical, 
  ChevronDown, 
  Building2, 
  LayoutGrid,
  CalendarX,
  TrendingUp,
  Calendar
} from 'lucide-vue-next'

const query = useCollectorDashboard()
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

const isDrawerOpen = ref(false)
const selectedReceipt = ref<any>(null)

const showFigures = ref(true)
const isBalancesExpanded = ref(true)
const isMoreExpanded = ref(false)

function openReceipt(receipt: any) {
  selectedReceipt.value = receipt
  isDrawerOpen.value = true
}

const isDesktop = computed(() => windowWidth.value >= 1024)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const stats = computed(() => {
  if (!query.data.value) return []
  return [
    { label: 'Today Total', value: query.data.value.todayTotal, icon: 'TrendingUp', color: 'green' as const },
    { label: 'Receipts Issued', value: query.data.value.receiptsIssued, icon: 'FileText', color: 'purple' as const },
    { label: 'Active Events', value: query.data.value.assignedEvents, icon: 'Calendar', color: 'amber' as const },
    { label: 'Current Funds', value: query.data.value.assignedFunds, icon: 'Wallet', color: 'blue' as const }
  ]
})
</script>

<style scoped>
.italic {
  font-style: italic;
}
</style>
