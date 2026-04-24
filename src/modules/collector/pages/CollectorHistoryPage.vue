<template>
  <div class="space-y-5 pb-4">
    <section>
      <h2 class="text-2xl font-semibold text-white">
        Receipt History
      </h2>
      <p class="mt-2 text-sm text-slate-300">
        Review issued, pending, and voided receipts created by this collector only.
      </p>
    </section>

    <div class="grid grid-cols-4 gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        class="rounded-full px-3 py-2 text-xs font-medium transition"
        :class="activeFilter === filter.value ? 'bg-violet-500 text-white' : 'text-slate-300'"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading history…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load collector history"
      :message="query.error.value?.message ?? 'Try again later.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <template v-else>
      <div
        v-if="filteredReceipts.length === 0"
        class="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300"
      >
        No receipts match this filter.
      </div>

      <template v-else>
        <button
          v-for="receipt in filteredReceipts"
          :key="receipt.id"
          type="button"
          class="w-full rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 text-left"
          @click="router.push(`/collector/receipts/${receipt.id}`)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-white">
                {{ receipt.receiptNumber }}
              </p>
              <p class="mt-2 text-xl font-semibold text-white">
                {{ receipt.amount }}
              </p>
              <p class="mt-3 text-sm text-slate-300">
                {{ receipt.eventTitle }} · {{ receipt.recipientFundName }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ receipt.issuedAt }}
              </p>
            </div>
            <ReceiptStatusBadge :status="receipt.status" />
          </div>
        </button>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectorHistory } from '../composables/useCollector'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'

const router = useRouter()
const query = useCollectorHistory()
const activeFilter = ref<'all' | 'issued' | 'pending' | 'voided'>('all')
const filters = [
  { label: 'All', value: 'all' as const },
  { label: 'Issued', value: 'issued' as const },
  { label: 'Pending', value: 'pending' as const },
  { label: 'Voided', value: 'voided' as const },
]

const filteredReceipts = computed(() => {
  const receipts = query.data.value ?? []
  if (activeFilter.value === 'all') {
    return receipts
  }

  return receipts.filter(receipt => receipt.status.toLowerCase() === activeFilter.value)
})
</script>
