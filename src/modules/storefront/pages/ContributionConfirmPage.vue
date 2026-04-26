<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Contribution flow"
      title="Confirm contribution"
      description="Review the contribution details before the final payment handoff."
    />

    <AppCard>
      <dl class="grid gap-4 md:grid-cols-2">
        <div class="rounded-none bg-slate-50 p-4">
          <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Amount
          </dt>
          <dd class="mt-2 text-base font-semibold text-slate-950">
            {{ formatCurrency(flowStore.draft.amount) }}
          </dd>
        </div>
        <div class="rounded-none bg-slate-50 p-4">
          <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Payment method
          </dt>
          <dd class="mt-2 text-base font-semibold capitalize text-slate-950">
            {{ flowStore.draft.paymentMethod }}
          </dd>
        </div>
        <div class="rounded-none bg-slate-50 p-4 md:col-span-2">
          <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Contributor
          </dt>
          <dd class="mt-2 text-base font-semibold text-slate-950">
            {{ flowStore.draft.anonymous ? 'Anonymous contributor' : flowStore.draft.contributorName }}
          </dd>
        </div>
      </dl>
      <div class="mt-6 flex justify-between gap-3">
        <AppButton
          variant="secondary"
          @click="router.push(`/contribute/${eventSlug}/payment`)"
        >
          Back
        </AppButton>
        <AppButton @click="router.push(`/contribute/${eventSlug}/success`)">
          Confirm contribution
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import { formatCurrency } from '@/core/formatting/formatters'

const route = useRoute()
const router = useRouter()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const flowStore = useContributionFlowStore()
</script>
