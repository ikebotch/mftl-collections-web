<template>
  <div class="space-y-12">
    <AdminPageHeader
      :title="copy.admin.pages.dashboard.title"
      :description="copy.admin.pages.dashboard.description"
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="bg-transparent border-slate-200"
          >
            <Calendar class="w-4 h-4 mr-2 text-slate-400" />
            <span class="text-xs font-bold text-slate-700">Last 30 Days</span>
          </AppButton>
          <AppButton
            variant="primary"
            @click="router.push('/admin/events/new')"
          >
            <Plus class="w-4 h-4 mr-2" />
            New Event
          </AppButton>
        </div>
      </template>
    </AdminPageHeader>

    <LoadingState
      v-if="query.isLoading.value"
      text="Optimizing your dashboard data..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Dashboard Offline"
      :message="query.error.value?.message ?? 'We encountered a sync issue. Please retry.'"
      show-retry
      @retry="query.refetch"
    />
    
    <template v-else>
      <!-- Hero Stats Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Collections (Gross)"
          :value="formattedTotals"
          icon="Wallet"
          color="purple"
          trend="+14.2%"
          trend-positive
        />
        <MetricCard
          label="Unique Donors"
          :value="String(query.data.value?.totalDonors ?? 0)"
          icon="Users"
          color="blue"
          trend="+8 today"
          trend-positive
        />
        <MetricCard
          label="Active Events"
          :value="String(query.data.value?.totalEvents ?? 0)"
          icon="Calendar"
          color="amber"
          :progress="75"
          progress-label="Goal occupancy"
        />
        <MetricCard
          label="Verified Receipts"
          :value="String(query.data.value?.totalReceipts ?? 0)"
          icon="ShieldCheck"
          color="green"
          trend="100% sync"
          trend-positive
        />
      </div>

      <div class="grid gap-8 lg:grid-cols-12">
        <!-- Campaign Performance Ledger (Full Width) -->
        <div class="lg:col-span-12 space-y-6">
          <AppCard class="!p-0 border-slate-200/60 shadow-premium overflow-hidden bg-white/40">
            <div class="p-10 border-b border-slate-100 flex items-center justify-between">
              <div class="space-y-1">
                <h3 class="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Campaign Performance Ledger</h3>
                <p class="text-base font-black text-slate-900 tracking-tight italic">Detailed financial auditing</p>
              </div>
              <span class="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-100">
                <span class="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                Live Updates
              </span>
            </div>

            <DataTable
              :columns="reportColumns"
              :rows="eventPerformance"
              :page-size="5"
            >
              <template #cell:title="{ row }">
                <div class="flex items-center gap-6 py-2">
                  <div class="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                    <Calendar class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-900 tracking-tight uppercase leading-none">{{ row.title }}</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{{ row.count }} Records Audited</p>
                  </div>
                </div>
              </template>

              <template #cell:total="{ row }">
                <div class="flex flex-col gap-1">
                  <span 
                    v-for="(amt, curr) in row.totals" 
                    :key="curr"
                    class="text-sm font-black text-slate-900 italic leading-none"
                  >
                    {{ formatCurrency(amt, curr) }}
                  </span>
                </div>
              </template>

              <template #cell:percent="{ row }">
                <div class="flex items-center gap-4">
                  <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{{ row.percent }}%</span>
                  <div class="w-32 bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500" :style="{ width: row.percent + '%' }" />
                  </div>
                </div>
              </template>
            </DataTable>
          </AppCard>
        </div>

        <!-- Main Activity Column -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Live Contribution Stream -->
          <AppCard class="!p-0 border-slate-200 bg-white/40">
            <div class="p-8 border-b border-slate-200 flex items-center justify-between bg-slate-50/10">
              <div class="space-y-1">
                <h3 class="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">
                  Live Contribution Stream
                </h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Real-time reconciliation across all active events
                </p>
              </div>
              <AppButton
                variant="ghost"
                size="xs"
                class="text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 border border-slate-100"
                @click="router.push('/admin/contributions')"
              >
                Intelligence View
              </AppButton>
            </div>
            
            <div
              v-if="!query.data.value?.recentContributions.length"
              class="p-16 text-center"
            >
              <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <Activity class="w-6 h-6 text-slate-300" />
              </div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                No active contribution activity detected
              </p>
            </div>
            
            <div
              v-else
              class="divide-y divide-slate-100"
            >
              <div
                v-for="(contribution, index) in query.data.value?.recentContributions"
                :key="index"
                class="flex items-center justify-between p-6 hover:bg-slate-50/20 transition-all cursor-pointer group"
              >
                <div class="flex items-center gap-5">
                  <div class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-violet-300 transition-all duration-500">
                    <Heart class="w-4 h-4 text-violet-600 fill-violet-50" />
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-900 tracking-tight">
                      {{ contribution.contributorName }}
                    </p>
                    <div class="flex items-center gap-3 mt-1.5">
                      <span class="text-[9px] font-black px-1.5 py-0.5 rounded-none bg-slate-100 text-slate-500 uppercase tracking-widest border border-slate-200/50">
                        {{ contribution.paymentMethod }}
                      </span>
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        {{ contribution.eventTitle }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-slate-900 italic mb-1 tracking-tight">
                    {{ formatCurrency(contribution.amount, contribution.currency) }}
                  </p>
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {{ formatDate(contribution.date) }}
                  </p>
                </div>
              </div>
            </div>
            <div class="p-6 bg-slate-50/10 text-center border-t border-slate-100">
              <button
                class="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline tracking-[0.2em]"
                @click="router.push('/admin/contributions')"
              >
                Expand Activity Archive
              </button>
            </div>
          </AppCard>
        </div>

        <!-- System Intelligence Sidebar -->
        <div class="lg:col-span-4 space-y-8">
          <AppCard class="!p-8 space-y-8 border-slate-200">
            <div class="flex items-center justify-between">
              <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Organization Health
              </h3>
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            
            <div class="space-y-6">
              <div class="flex justify-between items-center group cursor-help">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-none bg-slate-50 text-emerald-600 border border-slate-100">
                    <Zap class="w-3.5 h-3.5" />
                  </div>
                  <span class="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Sync Status</span>
                </div>
                <StatusBadge
                  status="Stable"
                  tone="success"
                />
              </div>

              <div class="flex justify-between items-center group">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-none bg-slate-50 text-violet-600 border border-slate-100">
                    <UserCheck class="w-3.5 h-3.5" />
                  </div>
                  <span class="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Field Force</span>
                </div>
                <span class="text-xs font-black text-slate-900">{{ query.data.value?.totalCollectors }} Staff</span>
              </div>

              <div class="flex justify-between items-center group">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-none bg-slate-50 text-amber-600 border border-slate-100">
                    <Target class="w-3.5 h-3.5" />
                  </div>
                  <span class="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Active Funds</span>
                </div>
                <span class="text-xs font-black text-slate-900">{{ query.data.value?.activeRecipientFunds }} Recipient</span>
              </div>
            </div>

            <div class="pt-6 border-t border-slate-100">
              <div class="p-5 rounded-none bg-slate-50 border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Resource Allocation
                </p>
                <div class="space-y-4">
                  <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span class="text-slate-500">Fund Coverage</span>
                    <span class="text-slate-900">85%</span>
                  </div>
                  <div class="h-1 w-full bg-white rounded-none overflow-hidden border border-slate-200/50">
                    <div class="h-full bg-violet-500 w-[85%]" />
                  </div>
                </div>
              </div>
            </div>
          </AppCard>

          <AppCard class="!p-8 bg-slate-900 text-white shadow-none space-y-8 relative overflow-hidden group border-none">
            <!-- Decorative accent -->
            <div class="absolute right-0 top-0 w-1 h-full bg-violet-600" />
            
            <div class="relative space-y-3">
              <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">
                Rapid Provisioning
              </h3>
              <p class="text-xl font-black tracking-tight italic leading-tight uppercase">
                Scale Your <br>Collection <br>Ops
              </p>
            </div>
            
            <div class="relative space-y-4">
              <AppButton
                variant="primary"
                class="w-full shadow-xl shadow-violet-500/20 !border-none text-[10px] uppercase tracking-[0.2em] py-4"
                @click="router.push('/admin/collectors/new')"
              >
                Onboard New Collector
              </AppButton>
              <AppButton
                variant="outline"
                class="w-full !border-white/20 !text-white hover:!bg-white/5 text-[10px] uppercase tracking-[0.2em] py-4"
                @click="router.push('/admin/reports')"
              >
                Performance Audit
              </AppButton>
            </div>
          </AppCard>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCopy } from '@/core/i18n/useCopy'
import { useDashboard } from '../composables/useDashboard'
import { useContributions } from '@/modules/contributions/composables/useContributions'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import { 
  Calendar,
  Plus, 
  Heart,
  Activity,
  Zap,
  UserCheck,
  Target,
  Wallet,
  Users,
  ShieldCheck
} from 'lucide-vue-next'

const { copy } = useCopy()
const router = useRouter()
const query = useDashboard()
const contribQuery = useContributions()

const contributions = computed(() => contribQuery.data.value?.items || [])

const reportColumns = [
  { key: 'title', label: 'Campaign' },
  { key: 'total', label: 'Aggregated' },
  { key: 'percent', label: 'Velocity' }
]

const totalsByCurrency = computed(() => {
  const map: Record<string, number> = {}
  contributions.value.forEach(c => {
    map[c.currency] = (map[c.currency] || 0) + c.amountValue
  })
  return map
})

const eventPerformance = computed(() => {
  const events: Record<string, { totals: Record<string, number>, count: number }> = {}
  
  contributions.value.forEach(c => {
    const eventTitle = c.event || 'Legacy Campaign'
    if (!events[eventTitle]) events[eventTitle] = { totals: {}, count: 0 }
    events[eventTitle].totals[c.currency] = (events[eventTitle].totals[c.currency] || 0) + c.amountValue
    events[eventTitle].count++
  })
  
  return Object.entries(events).map(([title, data]) => {
    const mainCurrency = Object.keys(data.totals)[0] || 'GHS'
    const totalForPercent = data.totals[mainCurrency] || 0
    const globalTotalForPercent = totalsByCurrency.value[mainCurrency] || 1
    
    return {
      title,
      totals: data.totals,
      count: data.count,
      percent: Math.min(100, Math.round((totalForPercent / globalTotalForPercent) * 100))
    }
  }).sort((a, b) => {
    const valA = Object.values(a.totals)[0] || 0
    const valB = Object.values(b.totals)[0] || 0
    return valB - valA
  }).slice(0, 5)
})

const formattedTotals = computed(() => {
  const totals = query.data.value?.totals ?? []
  if (totals.length === 0) return 'GHS 0.00'
  return totals.map(t => formatCurrency(t.amount, t.currency)).join(' • ')
})
</script>
