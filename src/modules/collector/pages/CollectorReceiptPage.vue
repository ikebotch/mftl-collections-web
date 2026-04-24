<template>
  <div class="space-y-6">
    <section class="space-y-3">
      <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
        Collector
      </p>
      <h2 class="text-3xl font-semibold tracking-tight text-white">
        Receipt confirmation
      </h2>
      <p class="max-w-2xl text-sm leading-6 text-slate-300">
        Receipt details are loaded directly from the backend so you can confirm the collected amount before the donor leaves.
      </p>
    </section>
    <LoadingState
      v-if="query.isLoading.value"
      text="Loading receipt…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load receipt"
      :message="query.error.value?.message ?? 'Try again later.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <AppCard
      v-else-if="query.data.value"
      class="max-w-4xl border-white/10 bg-white/95 shadow-2xl shadow-slate-950/30"
    >
      <SectionHeader
        title="Receipt confirmation"
        :description="`Receipt ${query.data.value.receiptNumber}`"
      />
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Contributor
          </p>
          <p class="mt-2 text-lg font-semibold text-slate-900">
            {{ query.data.value.contributorName }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Amount
          </p>
          <p class="mt-2 text-lg font-semibold text-slate-900">
            {{ query.data.value.amount }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Event
          </p>
          <p class="mt-2 text-lg font-semibold text-slate-900">
            {{ query.data.value.eventTitle }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recipient fund
          </p>
          <p class="mt-2 text-lg font-semibold text-slate-900">
            {{ query.data.value.recipientFundName }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <ReceiptStatusBadge :status="query.data.value.status" />
        <ContributionStatusBadge :status="query.data.value.contributionStatus" />
        <PaymentStatusBadge :status="query.data.value.paymentStatus" />
      </div>

      <div class="mt-6 rounded-2xl border border-slate-100 p-4 text-sm text-slate-600">
        <p><span class="font-semibold text-slate-900">Issued:</span> {{ query.data.value.issuedAt }}</p>
        <p class="mt-2">
          <span class="font-semibold text-slate-900">Payment method:</span> {{ query.data.value.paymentMethod }}
        </p>
        <p
          v-if="query.data.value.note"
          class="mt-2"
        >
          <span class="font-semibold text-slate-900">Note:</span> {{ query.data.value.note }}
        </p>
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <AppButton variant="secondary">
          Print receipt
        </AppButton>
        <AppButton variant="secondary">
          Download PDF
        </AppButton>
        <AppButton @click="router.push('/collector/history')">
          View recent collections
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReceipt } from '@/modules/receipts/composables/useReceipts'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import PaymentStatusBadge from '@/modules/payments/components/PaymentStatusBadge.vue'
import ContributionStatusBadge from '@/modules/contributions/components/ContributionStatusBadge.vue'

const route = useRoute()
const router = useRouter()
const receiptId = computed(() => String(route.params.id ?? ''))
const query = useReceipt(receiptId.value)
</script>
