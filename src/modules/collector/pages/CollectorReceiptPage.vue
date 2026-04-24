<template>
  <div class="space-y-5 pb-4">
    <section>
      <h2 class="text-2xl font-semibold text-white">
        Receipt
      </h2>
      <p class="mt-2 text-sm text-slate-300">
        Confirm the issued receipt before the donor leaves the collection point.
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
    <template v-else-if="query.data.value">
      <section class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Receipt number
            </p>
            <h3 class="mt-2 text-2xl font-semibold text-white">
              {{ query.data.value.receiptNumber }}
            </h3>
          </div>
          <ReceiptStatusBadge :status="query.data.value.status" />
        </div>

        <div class="mt-5 grid gap-3">
          <div class="rounded-[1.25rem] border border-white/10 bg-[#0F172A] px-4 py-3">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
              Event
            </p>
            <p class="mt-2 text-base font-medium text-white">
              {{ query.data.value.eventTitle }}
            </p>
          </div>
          <div class="rounded-[1.25rem] border border-white/10 bg-[#0F172A] px-4 py-3">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
              Fund
            </p>
            <p class="mt-2 text-base font-medium text-white">
              {{ query.data.value.recipientFundName }}
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-[1.25rem] border border-white/10 bg-[#0F172A] px-4 py-3">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
                Amount
              </p>
              <p class="mt-2 text-xl font-semibold text-white">
                {{ query.data.value.amount }}
              </p>
            </div>
            <div class="rounded-[1.25rem] border border-white/10 bg-[#0F172A] px-4 py-3">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
                Collector
              </p>
              <p class="mt-2 text-base font-medium text-white">
                {{ query.data.value.collectorName || 'Collector' }}
              </p>
            </div>
          </div>
          <div class="rounded-[1.25rem] border border-white/10 bg-[#0F172A] px-4 py-3">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
              Contributor
            </p>
            <p class="mt-2 text-base font-medium text-white">
              {{ query.data.value.isAnonymous ? 'Anonymous' : query.data.value.contributorName }}
            </p>
            <p
              v-if="query.data.value.contributorPhone"
              class="mt-2 text-sm text-slate-300"
            >
              Phone: {{ query.data.value.contributorPhone }}
            </p>
            <p
              v-if="query.data.value.contributorEmail"
              class="mt-1 text-sm text-slate-300"
            >
              Email: {{ query.data.value.contributorEmail }}
            </p>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-3">
        <div class="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
            Contribution status
          </p>
          <div class="mt-3">
            <ContributionStatusBadge :status="query.data.value.contributionStatus" />
          </div>
        </div>
        <div class="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
            Payment status
          </p>
          <div class="mt-3">
            <PaymentStatusBadge :status="query.data.value.paymentStatus" />
          </div>
        </div>
      </section>

      <section class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
        <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
          Date and time
        </p>
        <p class="mt-2 text-base text-white">
          {{ query.data.value.issuedAt }}
        </p>
        <p class="mt-4 text-sm text-slate-300">
          Method: {{ query.data.value.paymentMethod }}
        </p>
        <p
          v-if="query.data.value.note"
          class="mt-2 text-sm text-slate-300"
        >
          Note: {{ query.data.value.note }}
        </p>
      </section>

      <div class="grid gap-3">
        <AppButton
          class="w-full !rounded-[1.25rem] !py-4"
          @click="$router.push('/collector/contributions/new')"
        >
          New collection
        </AppButton>
        <div class="grid grid-cols-2 gap-3">
          <AppButton variant="secondary">
            Print placeholder
          </AppButton>
          <AppButton variant="secondary">
            Download placeholder
          </AppButton>
        </div>
        <AppButton
          variant="ghost"
          @click="$router.push('/collector')"
        >
          Back to dashboard
        </AppButton>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useReceipt } from '@/modules/receipts/composables/useReceipts'
import ContributionStatusBadge from '@/modules/contributions/components/ContributionStatusBadge.vue'
import PaymentStatusBadge from '@/modules/payments/components/PaymentStatusBadge.vue'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'

const route = useRoute()
const receiptId = computed(() => String(route.params.id ?? ''))
const query = useReceipt(receiptId.value)
</script>
