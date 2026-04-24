<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-display tracking-tight text-slate-900">
          Contribution Finance
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          Detailed audit trail of all contributions and payment statuses.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <AppButton
          variant="outline"
          class="hidden sm:flex"
        >
          <Download class="w-4 h-4 mr-2" />
          Export CSV
        </AppButton>
        <AppButton
          variant="primary"
        >
          <Filter class="w-4 h-4 mr-2" />
          Advanced Filter
        </AppButton>
      </div>
    </div>

    <!-- KPI Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Raised"
        :value="formatCurrency(totalRaised, 'GHS')"
        icon="Coins"
        color="green"
      />
      <MetricCard
        label="This Month"
        :value="formatCurrency(4200, 'GHS')"
        icon="Calendar"
        trend="+15%"
      />
      <MetricCard
        label="Avg. Contribution"
        :value="formatCurrency(averageContribution, 'GHS')"
        icon="Zap"
      />
      <MetricCard
        label="Failed Payments"
        value="3"
        icon="AlertCircle"
        color="red"
      />
    </div>

    <!-- Analytics Placeholder Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 h-64 flex flex-col">
        <SectionHeader title="Volume Over Time" />
        <div class="flex-1 mt-4 bg-slate-50 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          <TrendingUp class="w-12 h-12 mb-2 opacity-20" />
          Chart Pending
        </div>
      </div>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 h-64 flex flex-col">
        <SectionHeader title="Methods Breakdown" />
        <div class="flex-1 mt-4 flex flex-col justify-center space-y-3">
          <div
            v-for="method in [['Mobile Money', 65, 'emerald'], ['Card', 25, 'violet'], ['Cash', 10, 'amber']]"
            :key="method[0]"
            class="space-y-1"
          >
            <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span class="text-slate-500">{{ method[0] }}</span>
              <span class="text-slate-900">{{ method[1] }}%</span>
            </div>
            <ProgressBar
              :value="Number(method[1])"
              :variant="method[2] as any"
            />
          </div>
        </div>
      </div>
    </div>

    <AppToolbar>
      <AppInput
        id="contrib-search"
        model-value=""
        label="Search"
        placeholder="Donor, Receipt..."
      />
      <AppInput
        id="contrib-event"
        model-value=""
        label="Event"
        placeholder="All events"
      />
      <AppSelect
        id="contrib-status"
        model-value=""
        label="Status"
        :options="[{ label: 'All Status', value: '' }, { label: 'Completed', value: 'completed' }, { label: 'Pending', value: 'pending' }, { label: 'Failed', value: 'failed' }]"
      />
      <template #actions>
        <AppButton
          variant="secondary"
          size="sm"
        >
          Reset
        </AppButton>
      </template>
    </AppToolbar>

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading contributions..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Failed to load contributions"
      :message="query.error.value?.message ?? 'Retry sync.'"
      @retry="query.refetch"
    />
    <EmptyState
      v-else-if="!query.data.value?.length"
      title="No transaction history"
      description="All contributions across your events will appear here."
    />

    <AppCard
      v-else
      class="overflow-hidden"
    >
      <AppTable
        :columns="columns"
        :rows="query.data.value"
        row-key="id"
      >
        <template #cell:amount="{ value }">
          <span class="font-black text-slate-900">{{ formatCurrency(Number(value), 'GHS') }}</span>
        </template>
        
        <template #cell:status="{ value }">
          <ContributionStatusBadge :status="String(value)" />
        </template>

        <template #cell:actions="{ row }">
          <AppButton
            variant="secondary"
            size="sm"
            @click="openDetail(row)"
          >
            Details
          </AppButton>
        </template>
      </AppTable>
    </AppCard>

    <!-- Detail Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Contribution Detail"
      :subtitle="selectedContribution?.id"
      @close="isDrawerOpen = false"
    >
      <div
        v-if="selectedContribution"
        class="space-y-8"
      >
        <div class="flex flex-col items-center py-6 bg-slate-50 rounded-3xl border border-slate-100">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Total Amount
          </p>
          <p class="text-4xl font-black text-slate-900 font-display">
            {{ formatCurrency(Number(selectedContribution.amount), 'GHS') }}
          </p>
          <div class="mt-4">
            <ContributionStatusBadge :status="selectedContribution.status" />
          </div>
        </div>

        <div class="space-y-6">
          <SectionHeader title="Transaction Details" />
          <div class="grid grid-cols-2 gap-y-6">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Date
              </p>
              <p class="text-sm font-bold text-slate-900">
                {{ formatDate(selectedContribution.date) }}
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Method
              </p>
              <p class="text-sm font-bold text-slate-900 uppercase">
                {{ selectedContribution.paymentMethod }}
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Event
              </p>
              <p class="text-sm font-bold text-slate-900">
                {{ selectedContribution.event }}
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Recipient Fund
              </p>
              <p class="text-sm font-bold text-slate-900">
                {{ selectedContribution.recipientFund }}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-6 border-t border-slate-100">
          <AppButton
            variant="outline"
            class="w-full"
          >
            <FileText class="w-4 h-4 mr-2" />
            View Full Receipt
          </AppButton>
          <AppButton
            variant="secondary"
            class="w-full"
          >
            <Mail class="w-4 h-4 mr-2" />
            Resend Receipt
          </AppButton>
        </div>
      </div>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContributions } from '../composables/useContributions'
import type { ContributionRow } from '../types/contribution'
import ContributionStatusBadge from '../components/ContributionStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppToolbar from '@/shared/components/toolbars/AppToolbar.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'
import ProgressBar from '@/shared/components/misc/ProgressBar.vue'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'
import { 
  Download, 
  Filter, 
  TrendingUp, 
  FileText, 
  Mail 
} from 'lucide-vue-next'

const query = useContributions()

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'event', label: 'Event' },
  { key: 'paymentMethod', label: 'Method' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

const totalRaised = computed(() => {
  return query.data.value?.reduce((acc, curr) => {
    // Extract numeric value from "GHS X.XX" format
    const numericAmount = Number(String(curr.amount || '0').replace(/[^0-9.]/g, ''))
    return acc + numericAmount
  }, 0) || 0
})

const averageContribution = computed(() => {
  if (!query.data.value?.length) return 0
  return totalRaised.value / query.data.value.length
})

const isDrawerOpen = ref(false)
const selectedContribution = ref<ContributionRow | null>(null)

function openDetail(row: ContributionRow) {
  selectedContribution.value = row
  isDrawerOpen.value = true
}
</script>
