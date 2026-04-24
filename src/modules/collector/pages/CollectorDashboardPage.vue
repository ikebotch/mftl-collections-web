<template>
  <div class="space-y-6">
    <section class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-3">
        <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
          Collector
        </p>
        <h2 class="text-3xl font-semibold tracking-tight text-white">
          Field dashboard
        </h2>
        <p class="max-w-2xl text-sm leading-6 text-slate-300">
          See live collection totals, recent receipts, and jump into the next contribution with one tap.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <AppButton
          size="lg"
          @click="$router.push('/collector/contributions/new')"
        >
          New contribution
        </AppButton>
        <AppButton
          variant="secondary"
          size="lg"
          @click="$router.push('/collector/history')"
        >
          View history
        </AppButton>
      </div>
    </section>

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading collector dashboard…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load collector dashboard"
      :message="query.error.value?.message ?? 'Try again later.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <template v-else>
      <div class="grid gap-4 md:grid-cols-3">
        <AppCard class="border-cyan-300/10 bg-white/95 shadow-2xl shadow-slate-950/20">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Total collected
          </p>
          <p class="mt-3 text-3xl font-semibold text-slate-950">
            {{ query.data.value?.totalCollected ?? 'GBP 0.00' }}
          </p>
        </AppCard>
        <AppCard class="border-cyan-300/10 bg-white/95 shadow-2xl shadow-slate-950/20">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Contributions
          </p>
          <p class="mt-3 text-3xl font-semibold text-slate-950">
            {{ query.data.value?.contributionCount ?? '0' }}
          </p>
        </AppCard>
        <AppCard class="border-cyan-300/10 bg-white/95 shadow-2xl shadow-slate-950/20">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Assigned events
          </p>
          <p class="mt-3 text-3xl font-semibold text-slate-950">
            {{ query.data.value?.assignedEvents ?? '0' }}
          </p>
        </AppCard>
      </div>

      <AppCard class="border-white/10 bg-white/95 shadow-2xl shadow-slate-950/30">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Recent activity
            </p>
            <h3 class="mt-1 text-xl font-semibold text-slate-950">
              Latest receipts
            </h3>
          </div>
          <AppButton
            variant="secondary"
            size="sm"
            @click="$router.push('/collector/history')"
          >
            View all
          </AppButton>
        </div>

        <EmptyState
          v-if="(query.data.value?.recentReceipts.length ?? 0) === 0"
          title="No contributions recorded yet"
          description="Your first successful contribution will appear here immediately after receipt issuance."
        />
        <AppTable
          v-else
          caption="Recent collector receipts"
          :columns="columns"
          :rows="query.data.value?.recentReceipts ?? []"
          row-key="id"
        >
          <template #cell:status="{ value }">
            <ReceiptStatusBadge :status="String(value)" />
          </template>
        </AppTable>
      </AppCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCollectorDashboard } from '../composables/useCollector'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'

const query = useCollectorDashboard()
const columns = [
  { key: 'receiptNumber', label: 'Receipt' },
  { key: 'eventTitle', label: 'Event' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Receipt status' },
]
</script>
