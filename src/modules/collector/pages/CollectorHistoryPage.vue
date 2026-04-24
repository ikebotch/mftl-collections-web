<template>
  <div class="space-y-6">
    <section class="space-y-3">
      <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
        Collector
      </p>
      <h2 class="text-3xl font-semibold tracking-tight text-white">
        Recent collections
      </h2>
      <p class="max-w-2xl text-sm leading-6 text-slate-300">
        Review live receipt activity and jump straight back into collection capture when needed.
      </p>
    </section>

    <AppCard class="border-white/10 bg-white/95 shadow-2xl shadow-slate-950/30">
      <LoadingState
        v-if="query.isLoading.value"
        text="Loading collector history…"
      />
      <ErrorState
        v-else-if="query.isError.value"
        title="Could not load collector history"
        :message="query.error.value?.message ?? 'Try again later.'"
        :correlation-id="query.error.value?.correlationId"
        show-retry
        @retry="query.refetch"
      />
      <EmptyState
        v-else-if="(query.data.value?.length ?? 0) === 0"
        title="No collection history yet"
        description="Receipts will appear here after the first successful contribution is recorded."
      />
      <AppTable
        v-else
        caption="Collector history"
        :columns="columns"
        :rows="query.data.value ?? []"
        row-key="id"
      >
        <template #cell:status="{ value }">
          <ReceiptStatusBadge :status="String(value)" />
        </template>
        <template #cell:actions="{ row }">
          <AppButton
            size="sm"
            @click="router.push(`/collector/receipts/${getRowValue(row, 'id')}`)"
          >
            View receipt
          </AppButton>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCollectorHistory } from '../composables/useCollector'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'

const router = useRouter()
const query = useCollectorHistory()
const columns = [
  { key: 'receiptNumber', label: 'Receipt' },
  { key: 'eventTitle', label: 'Event' },
  { key: 'contributorName', label: 'Contributor' },
  { key: 'paymentMethod', label: 'Method' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Receipt' },
  { key: 'actions', label: 'Actions' },
]

function getRowValue(row: unknown, key: string): string {
  if (row && typeof row === 'object') {
    return String((row as Record<string, unknown>)[key] ?? '')
  }

  return ''
}
</script>
