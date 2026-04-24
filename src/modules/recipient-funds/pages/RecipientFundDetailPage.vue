<template>
  <div
    v-if="query.isLoading.value"
    class="py-32"
  >
    <LoadingState text="Loading fund details..." />
  </div>
  <ErrorState
    v-else-if="query.isError.value"
    title="Failed to load fund"
    :message="query.error.value?.message ?? 'Sync failed'"
    show-retry
    @retry="query.refetch"
  />
  <div
    v-else-if="fund"
    class="space-y-10"
  >
    <DetailPageHeader
      :title="fund.name"
      :description="`Recipient fund configuration and tracking.`"
      :back-to="{ name: 'admin-funds' }"
    >
      <template #meta>
        <div class="flex items-center gap-4">
          <StatusBadge
            :status="fund.receivedAmount >= fund.targetAmount ? 'completed' : 'active'"
            :tone="fund.receivedAmount >= fund.targetAmount ? 'success' : 'neutral'"
          />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Fund operational state
          </span>
        </div>
      </template>

      <template #actions>
        <AppButton
          variant="outline"
          class="!rounded-xl"
          @click="router.push({ name: 'admin-funds-edit', params: { id: fundId } })"
        >
          <Edit class="w-4 h-4 mr-2" /> Edit Fund
        </AppButton>
      </template>
    </DetailPageHeader>

    <AdminMetricGrid>
      <MetricCard
        label="Total Raised"
        :value="formatCurrency(fund.receivedAmount, fund.currency)"
        icon="TrendingUp"
        color="green"
      />
      <MetricCard
        label="Target Amount"
        :value="formatCurrency(fund.targetAmount, fund.currency)"
        icon="Target"
        color="slate"
      />
      <MetricCard
        label="Remaining"
        :value="formatCurrency(Math.max(fund.targetAmount - fund.receivedAmount, 0), fund.currency)"
        icon="Clock"
        color="amber"
      />
      <MetricCard
        label="Contributors"
        value="0"
        icon="Users"
        color="purple"
      />
    </AdminMetricGrid>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8 space-y-8">
        <AppCard class="!p-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
            Description
          </h3>
          <p class="text-slate-600 leading-relaxed">
            {{ fund.description || 'No description provided for this fund.' }}
          </p>
        </AppCard>

        <AppCard class="!p-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
            Recent Contributions
          </h3>
          <div class="flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <p class="font-medium">
              Contribution list pending backend data.
            </p>
          </div>
        </AppCard>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <DetailSummaryCard 
          title="Fund Metadata"
          :items="summaryItems"
        />

        <AppCard class="!p-8 bg-emerald-600 text-white shadow-premium">
          <h4 class="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">
            Progress to Target
          </h4>
          <div class="space-y-6">
            <div class="flex justify-between items-end">
              <span class="text-3xl font-black tracking-tight">{{ Math.round((fund.receivedAmount / fund.targetAmount) * 100) }}%</span>
              <span class="text-xs font-bold opacity-70">Target: {{ formatCurrency(fund.targetAmount, fund.currency) }}</span>
            </div>
            <div class="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                class="h-full bg-white transition-all duration-1000"
                :style="{ width: `${Math.min((fund.receivedAmount / fund.targetAmount) * 100, 100)}%` }"
              />
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipientFund } from '../composables/useRecipientFunds'
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { Edit } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const fundId = computed(() => route.params.id as string)

const query = useRecipientFund(fundId.value)
const fund = computed(() => query.data.value)

const summaryItems = computed(() => {
  if (!fund.value) return []
  return [
    { key: 'event', label: 'Parent Event ID', value: fund.value.eventId || 'Unknown' },
    { key: 'currency', label: 'Base Currency', value: fund.value.currency || 'GHS' },
    { key: 'status', label: 'Current Status', value: fund.value.receivedAmount >= fund.value.targetAmount ? 'Completed' : 'Active' }
  ]
})
</script>
