<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Contribution flow"
      title="Select a payment method"
      description="Choose the method that matches how the contributor wants to complete the gift."
    />

    <div class="grid gap-4 md:grid-cols-2">
      <button
        v-for="option in filteredPaymentMethodOptions"
        :key="option.value"
        type="button"
        :class="[
          'rounded-none border p-6 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
          flowStore.draft.paymentMethod === option.value ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white',
        ]"
        @click="flowStore.patch({ paymentMethod: option.value })"
      >
        <h2 class="text-lg font-semibold text-slate-950">
          {{ option.label }}
        </h2>
      </button>
    </div>

    <AppCard>
      <p class="text-sm text-slate-500">
        Card and mobile money are ready for provider wiring. Cash / in-person explains the handoff process for onsite contributors.
      </p>
      <div class="mt-5 flex justify-between gap-3">
        <AppButton
          variant="secondary"
          @click="router.push(`/contribute/${eventSlug}/details`)"
        >
          Back
        </AppButton>
        <AppButton @click="onContinue">
          Review contribution
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import { paymentMethodOptions } from '@/shared/constants/paymentMethods'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'

const route = useRoute()
const router = useRouter()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const flowStore = useContributionFlowStore()

const filteredPaymentMethodOptions = computed(() => 
  paymentMethodOptions.filter(opt => opt.value !== 'cash') as Array<{ label: string, value: 'card' | 'momo' | 'bank' }>
)

function onContinue() {
  void router.push(`/contribute/${eventSlug.value}/confirm`)
}
</script>
