<template>
  <AppCard>
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-950">
          {{ fund.name }}
        </h3>
        <p class="mt-2 text-sm text-slate-500">
          {{ fund.description }}
        </p>
      </div>
      <AppBadge tone="info">
        {{ fund.currency }}
      </AppBadge>
    </div>
    <dl class="mt-6 grid gap-4 sm:grid-cols-2">
      <div class="rounded-2xl bg-slate-50 p-4">
        <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Target amount
        </dt>
        <dd class="mt-2 text-sm font-medium text-slate-950">
          {{ formatCurrency(fund.targetAmount, fund.currency) }}
        </dd>
      </div>
      <div class="rounded-2xl bg-slate-50 p-4">
        <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Received
        </dt>
        <dd class="mt-2 text-sm font-medium text-slate-950">
          {{ formatCurrency(fund.receivedAmount, fund.currency) }}
        </dd>
      </div>
    </dl>
  </AppCard>
</template>

<script setup lang="ts">
import type { RecipientFund } from '../types/recipientFund'
import AppBadge from '@/shared/components/badges/AppBadge.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import { formatCurrency } from '@/core/formatting/formatters'

defineProps<{
  fund: RecipientFund
}>()
</script>
