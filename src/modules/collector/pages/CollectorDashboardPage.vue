<template>
  <div class="space-y-5 pb-4">
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
    <template v-else-if="query.data.value">
      <section class="space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm text-slate-300">
              Good morning,
            </p>
            <h2 class="mt-1 text-2xl font-semibold text-white">
              {{ query.data.value.profile.name }}
            </h2>
            <p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              Collector ID: {{ query.data.value.profile.id.slice(0, 8) }}
            </p>
          </div>
          <div class="rounded-none border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Sync
            </p>
            <p class="mt-2 text-sm font-semibold text-emerald-300">
              {{ query.data.value.syncStatusLabel }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-none border border-emerald-400/15 bg-emerald-400/8 px-4 py-3">
          <div class="flex items-center gap-2 text-sm font-medium text-emerald-300">
            <span class="h-2.5 w-2.5 rounded-none bg-emerald-400" />
            {{ query.data.value.syncStatusLabel }}
          </div>
          <p class="text-xs text-slate-400">
            {{ query.data.value.syncStatusDescription }}
          </p>
        </div>
      </section>

      <section
        v-if="!query.data.value.profile.hasAssignments"
        class="rounded-none border border-amber-400/15 bg-amber-400/8 p-5"
      >
        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
          Collection blocked
        </p>
        <h3 class="mt-3 text-lg font-semibold text-white">
          Assign events and funds before collecting
        </h3>
        <p class="mt-2 text-sm leading-6 text-slate-300">
          {{ query.data.value.profile.blockedReason || query.data.value.assignments.blockedReason }}
        </p>
      </section>

      <section class="grid grid-cols-2 gap-3">
        <article class="rounded-none border border-white/10 bg-white/5 p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Today collected
          </p>
          <p class="mt-3 text-2xl font-semibold text-white">
            {{ query.data.value.todayTotal }}
          </p>
        </article>
        <article class="rounded-none border border-white/10 bg-white/5 p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Receipts issued
          </p>
          <p class="mt-3 text-2xl font-semibold text-white">
            {{ query.data.value.receiptsIssued }}
          </p>
        </article>
        <article class="rounded-none border border-white/10 bg-white/5 p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Assigned events
          </p>
          <p class="mt-3 text-2xl font-semibold text-white">
            {{ query.data.value.assignedEvents }}
          </p>
        </article>
        <article class="rounded-none border border-white/10 bg-white/5 p-4">
          <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Assigned funds
          </p>
          <p class="mt-3 text-2xl font-semibold text-white">
            {{ query.data.value.assignedFunds }}
          </p>
        </article>
      </section>

      <section class="space-y-3">
        <article class="rounded-none border border-white/10 bg-white/5 p-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Current shift
              </p>
              <h3 class="mt-2 text-lg font-semibold text-white">
                {{ query.data.value.currentShiftLabel }}
              </h3>
            </div>
            <span class="rounded-none bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200">
              {{ query.data.value.profile.status }}
            </span>
          </div>
        </article>

        <article class="rounded-none border border-white/10 bg-white/5 p-5">
          <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Sync status
          </p>
          <h3 class="mt-2 text-lg font-semibold text-white">
            {{ query.data.value.syncStatusLabel }}
          </h3>
          <p class="mt-2 text-sm text-slate-300">
            {{ query.data.value.syncStatusDescription }}
          </p>
        </article>
      </section>

      <AppButton
        class="!mt-1 w-full !rounded-none !py-4 text-base"
        size="lg"
        :disabled="!query.data.value.profile.hasAssignments"
        @click="$router.push('/collector/contributions/new')"
      >
        Start New Collection
      </AppButton>

      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white">
            Recent receipts
          </h3>
          <AppButton
            variant="ghost"
            size="sm"
            @click="$router.push('/collector/history')"
          >
            View history
          </AppButton>
        </div>

        <div
          v-if="query.data.value.recentReceipts.length === 0"
          class="rounded-none border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300"
        >
          No receipts issued yet.
        </div>

        <template v-else>
          <button
            v-for="receipt in query.data.value.recentReceipts"
            :key="receipt.id"
            type="button"
            class="w-full rounded-none border border-white/10 bg-white/[0.04] p-4 text-left"
            @click="$router.push(`/collector/receipts/${receipt.id}`)"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-white">
                  {{ receipt.receiptNumber }}
                </p>
                <p class="mt-1 text-lg font-semibold text-white">
                  {{ receipt.amount }}
                </p>
                <p class="mt-2 text-sm text-slate-300">
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
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCollectorDashboard } from '../composables/useCollector'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'

const query = useCollectorDashboard()
</script>
