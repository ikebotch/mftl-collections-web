<template>
  <div class="space-y-10">
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
            <span class="text-xs font-bold text-slate-700">Last 7 Days</span>
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
      <!-- Stats Grid -->
      <AdminMetricGrid>
        <MetricCard
          label="Total Collected"
          :value="formattedTotals"
          icon="Wallet"
          color="purple"
        />
        <MetricCard
          label="Active Events"
          :value="String(query.data.value?.totalEvents ?? 0)"
          icon="Calendar"
          color="amber"
        />
        <MetricCard
          label="Recipient Funds"
          :value="String(query.data.value?.activeRecipientFunds ?? 0)"
          icon="Target"
          color="blue"
        />
        <MetricCard
          label="Receipts Issued"
          :value="String(query.data.value?.totalReceipts ?? 0)"
          icon="ShieldCheck"
          color="green"
        />
      </AdminMetricGrid>

      <div class="grid gap-10 lg:grid-cols-12">
        <!-- Recent Activity -->
        <AppCard
          class="lg:col-span-8 !p-8 space-y-8"
        >
          <div class="flex items-center justify-between border-b border-slate-50 pb-6">
            <div class="space-y-1">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest italic">
                Recent Contributions
              </h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Latest transactions from all channels
              </p>
            </div>
            <AppButton variant="ghost" size="xs" class="text-[9px] font-black uppercase tracking-widest" @click="router.push('/admin/contributions')">
              View All
            </AppButton>
          </div>
          
          <div v-if="query.data.value?.recentContributions.length === 0" class="py-12 text-center text-slate-400 italic text-sm">
            No recent activity recorded yet.
          </div>
          
          <div v-else class="space-y-6">
            <div
              v-for="(contribution, index) in query.data.value?.recentContributions"
              :key="index"
              class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-slate-900 transition-all cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-soft">
                  <Heart class="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p class="text-sm font-black text-slate-900 tracking-tight">
                    {{ contribution.contributorName }}
                  </p>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {{ contribution.eventTitle }} · {{ contribution.paymentMethod }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-slate-900 italic">
                  {{ contribution.amount }}
                </p>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {{ contribution.date }}
                </p>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Sidebar panels -->
        <div class="lg:col-span-4 space-y-8">
          <AppCard class="!p-8 space-y-8">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
              System Health
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-slate-600">Sync Status</span>
                <StatusBadge status="Live" tone="success" />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-slate-600">Collectors</span>
                <span class="text-xs font-black text-slate-900">{{ query.data.value?.totalCollectors }} Active</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-slate-600">Donors</span>
                <span class="text-xs font-black text-slate-900">{{ query.data.value?.totalDonors }} Unique</span>
              </div>
            </div>
          </AppCard>

          <AppCard class="!p-8 bg-slate-900 text-white shadow-premium space-y-6">
            <div class="space-y-2">
              <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">
                Quick Actions
              </h3>
              <p class="text-sm font-black tracking-tight italic">
                Grow Your Impact
              </p>
            </div>
            <div class="space-y-4">
              <AppButton variant="primary" class="w-full !rounded-xl shadow-lg shadow-violet-500/20" @click="router.push('/admin/collectors/new')">
                Invite Collectors
              </AppButton>
              <AppButton variant="outline" class="w-full !rounded-xl !border-white/10 !text-white hover:!bg-white/5" @click="router.push('/admin/reports')">
                Intelligence Report
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

const { copy } = useCopy()
const router = useRouter()
const query = useDashboard()

const formattedTotals = computed(() => {
  const totals = query.data.value?.totals ?? []
  if (totals.length === 0) return 'GHS 0.00'
  return totals.map(t => formatCurrency(t.amount, t.currency)).join(' • ')
})

import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { 
  Calendar,
  Plus, 
  Heart
} from 'lucide-vue-next'
</script>
