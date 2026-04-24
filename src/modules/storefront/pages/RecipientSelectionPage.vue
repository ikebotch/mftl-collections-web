<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Contribution flow"
      title="Choose a recipient fund"
      description="Select the cause this contribution should support."
    />

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading recipient funds…"
    />
    <div
      v-else
      class="grid gap-4"
    >
      <RecipientFundOptionCard
        v-for="fund in query.data.value ?? []"
        :key="fund.id"
        :title="fund.name"
        :description="fund.description"
        :amount="formatCurrency(fund.targetAmount, fund.currency)"
        :selected="draft.recipientFundId === fund.id"
        @select="selectFund(fund.id)"
      />
    </div>

    <AppCard>
      <form
        class="space-y-4"
        @submit.prevent="onSubmit"
      >
        <AppInput
          id="contribution-amount"
          v-model="amount"
          type="number"
          label="Contribution amount"
          placeholder="50"
          :error="errors.amount || errors.recipientFundId"
        />
        <div class="flex justify-between gap-3">
          <AppButton
            variant="secondary"
            @click="router.push(`/contribute/${eventSlug}`)"
          >
            Back
          </AppButton>
          <AppButton native-type="submit">
            Continue
          </AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import { useStorefrontRecipientFunds } from '../composables/useStorefront'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import { amountSelectionSchema } from '../validators/storefrontValidators'
import RecipientFundOptionCard from '../components/RecipientFundOptionCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatCurrency } from '@/shared/utils/formatters'

const route = useRoute()
const router = useRouter()
const flowStore = useContributionFlowStore()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const query = useStorefrontRecipientFunds(eventSlug.value)
const amount = ref(flowStore.draft.amount ? String(flowStore.draft.amount) : '')
const errors = ref<Record<string, string>>({})
const draft = flowStore.draft

function selectFund(recipientFundId: string) {
  flowStore.patch({ recipientFundId })
}

function onSubmit() {
  errors.value = {}
  const result = amountSelectionSchema.safeParse({
    recipientFundId: flowStore.draft.recipientFundId,
    amount: amount.value,
  })

  if (!result.success) {
    applyZodErrors(result.error)
    return
  }

  flowStore.patch({
    amount: result.data.amount,
  })
  void router.push(`/contribute/${eventSlug.value}/details`)
}

function applyZodErrors(error: z.ZodError) {
  for (const issue of error.issues) {
    errors.value[String(issue.path[0] ?? '')] = issue.message
  }
}
</script>
