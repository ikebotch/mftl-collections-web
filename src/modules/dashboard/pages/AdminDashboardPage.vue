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
            class="!rounded-xl bg-white shadow-sm border-slate-200"
          >
            <Calendar class="w-4 h-4 mr-2 text-slate-400" />
            <span class="text-xs font-bold text-slate-700">Last 30 Days</span>
          </AppButton>
          <AppButton
            variant="primary"
            class="!rounded-xl shadow-premium"
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
        <!-- Main Activity Column -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Recent Contributions with premium editorial styling -->
          <AppCard class="!p-0 overflow-hidden border-none shadow-premium bg-white">
            <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div class="space-y-1">
                <h3 class="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">
                  Live Contribution Stream
                </h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Real-time reconciliation across all organizations
                </p>
              </div>
              <AppButton
                variant="ghost"
                size="xs"
                class="text-[9px] font-black uppercase tracking-widest hover:bg-white"
                @click="router.push('/admin/contributions')"
              >
                Intelligence View
              </AppButton>
            </div>
            
            <div
              v-if="!query.data.value?.recentContributions.length"
              class="p-16 text-center"
            >
              <div class="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Activity class="w-8 h-8 text-slate-200" />
              </div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
                No activity recorded
              </p>
            </div>
            
            <div
              v-else
              class="divide-y divide-slate-50"
            >
              <div
                v-for="(contribution, index) in query.data.value?.recentContributions"
                :key="index"
                class="flex items-center justify-between p-6 hover:bg-slate-50/80 transition-all cursor-pointer group"
              >
                <div class="flex items-center gap-5">
                  <div class="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-soft group-hover:border-violet-200 group-hover:scale-105 transition-all">
                    <Heart class="w-5 h-5 text-violet-600 fill-violet-50" />
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-900 tracking-tight">
                      {{ contribution.contributorName }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-widest">
                        {{ contribution.paymentMethod }}
                      </span>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {{ contribution.eventTitle }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-slate-900 italic mb-1">
                    {{ formatCurrency(contribution.amount, contribution.currency) }}
                  </p>
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {{ formatDate(contribution.date) }}
                  </p>
                </div>
              </div>
            </div>
            <div class="p-4 bg-slate-50/30 text-center border-t border-slate-50">
              <button
                class="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline"
                @click="router.push('/admin/contributions')"
              >
                Expand Stream Archive
              </button>
            </div>
          </AppCard>
        </div>

        <!-- System Intelligence Sidebar -->
        <div class="lg:col-span-4 space-y-8">
          <AppCard class="!p-8 space-y-8 border-none shadow-premium">
            <div class="flex items-center justify-between">
              <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Organization Health
              </h3>
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            
            <div class="space-y-6">
              <div class="flex justify-between items-center group cursor-help">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <Zap class="w-4 h-4" />
                  </div>
                  <span class="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Sync Status</span>
                </div>
                <StatusBadge
                  status="Stable"
                  tone="success"
                />
              </div>

              <div class="flex justify-between items-center group">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-violet-50 text-violet-600">
                    <UserCheck class="w-4 h-4" />
                  </div>
                  <span class="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Field Force</span>
                </div>
                <span class="text-xs font-black text-slate-900">{{ query.data.value?.totalCollectors }} Agents</span>
              </div>

              <div class="flex justify-between items-center group">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <Target class="w-4 h-4" />
                  </div>
                  <span class="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Recipient Funds</span>
                </div>
                <span class="text-xs font-black text-slate-900">{{ query.data.value?.activeRecipientFunds }} Active</span>
              </div>
            </div>

            <div class="pt-6 border-t border-slate-50">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Resource Allocation
                </p>
                <div class="space-y-3">
                  <div class="flex justify-between text-[10px] font-bold">
                    <span class="text-slate-500">Fund Coverage</span>
                    <span class="text-slate-900">85%</span>
                  </div>
                  <div class="h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <div class="h-full bg-violet-500 w-[85%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </AppCard>

          <AppCard class="!p-8 bg-slate-900 text-white shadow-2xl space-y-8 relative overflow-hidden group">
            <!-- Decorative circle -->
            <div class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-violet-500/10 group-hover:bg-violet-500/20 transition-all duration-700" />
            
            <div class="relative space-y-2">
              <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Rapid Provisioning
              </h3>
              <p class="text-lg font-black tracking-tight italic leading-tight">
                Scale Your Collection Infrastructure
              </p>
            </div>
            
            <div class="relative space-y-4">
              <AppButton
                variant="primary"
                class="w-full !rounded-xl shadow-xl shadow-violet-500/20 !border-none"
                @click="router.push('/admin/collectors/new')"
              >
                Onboard New Collector
              </AppButton>
              <AppButton
                variant="outline"
                class="w-full !rounded-xl !border-white/10 !text-white hover:!bg-white/5"
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
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import { 
  Calendar,
  Plus, 
  Heart,
  Activity,
  Zap,
  UserCheck,
  Target
} from 'lucide-vue-next'

const { copy } = useCopy()
const router = useRouter()
const query = useDashboard()

const formattedTotals = computed(() => {
  const totals = query.data.value?.totals ?? []
  if (totals.length === 0) return 'GHS 0.00'
  return totals.map(t => formatCurrency(t.amount, t.currency)).join(' • ')
})
</script>
