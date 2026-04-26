<template>
  <div class="space-y-16 animate-fade-in">
    <div class="space-y-4 text-center">
      <p class="text-[10px] font-black uppercase tracking-[0.4em] text-violet-600">Step 01 / 04</p>
      <h2 class="text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight">Choose a recipient</h2>
      <p class="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
        Select the specific cause or fund this contribution should support.
      </p>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Retrieving fund options…"
    />
    
    <div
      v-else
      class="grid gap-6"
    >
      <RecipientFundOptionCard
        v-for="fund in query.data.value?.filter(f => f.isActive) ?? []"
        :key="fund.id"
        :title="fund.name"
        :description="fund.description"
        :amount="formatCurrency(fund.targetAmount, 'GHS')"
        :selected="draft.recipientFundId === fund.id"
        @select="selectFund(fund.id)"
      />
      
      <div 
        v-if="!query.data.value?.filter(f => f.isActive).length && !query.isLoading.value"
        class="p-12 border-2 border-dashed border-slate-100 text-center space-y-4"
      >
        <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
          <span class="text-xl">🏜️</span>
        </div>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">No active funds found</p>
      </div>
    </div>

    <div class="pt-12 border-t border-slate-100 space-y-10">
      <div class="space-y-4">
        <label class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Contribution Amount (GHS)</label>
        <div class="relative group">
          <input
            v-model="amount"
            type="number"
            class="w-full bg-transparent border-b-2 border-slate-100 py-6 text-6xl md:text-8xl font-bold font-display text-slate-900 focus:outline-none focus:border-violet-600 transition-all placeholder:text-slate-100 tabular-nums"
            placeholder="0.00"
          >
          <div 
            v-if="errors.amount || errors.recipientFundId" 
            class="mt-4 text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2"
          >
            <span class="w-1 h-1 rounded-full bg-rose-500" />
            {{ errors.amount || errors.recipientFundId }}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-6 pt-10">
        <AppButton
          variant="ghost"
          size="lg"
          class="text-xs font-black uppercase tracking-[0.2em] px-0 hover:bg-transparent hover:text-violet-600"
          @click="router.push(`/give/${eventSlug}`)"
        >
          ← Back to overview
        </AppButton>
        <AppButton 
          size="lg"
          class="bg-slate-900 text-white min-w-[200px] shadow-xl hover:bg-violet-600 transition-all duration-500 text-xs font-black uppercase tracking-[0.2em]"
          @click="onSubmit"
        >
          Continue to Details
        </AppButton>
      </div>
    </div>
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
import { formatCurrency } from '@/core/formatting/formatters'

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
  void router.push(`/give/${eventSlug.value}/details`)
}

function applyZodErrors(error: z.ZodError) {
  for (const issue of error.issues) {
    errors.value[String(issue.path[0] ?? '')] = issue.message
  }
}
</script>
