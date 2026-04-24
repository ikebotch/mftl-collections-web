<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Contribution flow"
      title="Confirm contribution"
      description="Review the contribution details before the final payment handoff."
    />

    <AppCard>
      <dl class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 p-4">
          <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Amount
          </dt>
          <dd class="mt-2 text-base font-semibold text-slate-950">
            {{ formatCurrency(flowStore.draft.amount) }}
          </dd>
        </div>
        <div class="rounded-2xl bg-slate-50 p-4">
          <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Payment method
          </dt>
          <dd class="mt-2 text-base font-semibold capitalize text-slate-950">
            {{ flowStore.draft.paymentMethod }}
          </dd>
        </div>
        <div class="rounded-2xl bg-slate-50 p-4 md:col-span-2">
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
          :disabled="isSubmitting"
          @click="router.push(`/contribute/${eventSlug}/payment`)"
        >
          Back
        </AppButton>
        <AppButton 
          :loading="isSubmitting"
          @click="confirmContribution"
        >
          Confirm & Pay
        </AppButton>
      </div>
    </AppCard>

    <div
      v-if="error"
      class="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-600 text-sm font-medium"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import { initiatePublicContribution } from '../services/storefrontService'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import { formatCurrency } from '@/shared/utils/formatters'

const route = useRoute()
const router = useRouter()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const flowStore = useContributionFlowStore()

const isSubmitting = ref(false)
const error = ref<string | null>(null)

async function confirmContribution() {
  isSubmitting.value = true
  error.value = null

  try {
    const payload = {
      eventSlug: eventSlug.value,
      recipientFundId: flowStore.draft.recipientFundId,
      amount: flowStore.draft.amount,
      currency: 'GHS', // Fixed for now or from draft
      contributorName: flowStore.draft.contributorName,
      contributorEmail: flowStore.draft.contributorEmail,
      contributorPhone: flowStore.draft.contributorPhone,
      isAnonymous: flowStore.draft.anonymous,
      method: flowStore.draft.paymentMethod,
      note: flowStore.draft.note
    }

    const result = await initiatePublicContribution(payload)
    
    if (result.success && result.redirectUrl) {
      // For mock provider, we'll just redirect to the mock checkout
      window.location.href = result.redirectUrl
    } else {
      error.value = result.message || 'Failed to initiate payment.'
    }
  } catch (err: any) {
    console.error('Initiation error:', err)
    error.value = err.message || 'An unexpected error occurred.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
