import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ContributionDraft } from '../types/storefront'

function createDefaultDraft(): ContributionDraft {
  return {
    eventSlug: '',
    recipientFundId: '',
    amount: 0,
    contributorName: '',
    contributorPhone: '',
    contributorEmail: '',
    anonymous: false,
    note: '',
    paymentMethod: 'card',
  }
}

export const useContributionFlowStore = defineStore('contribution-flow', () => {
  const draft = ref<ContributionDraft>(createDefaultDraft())

  function initialise(eventSlug: string) {
    if (draft.value.eventSlug !== eventSlug) {
      draft.value = {
        ...createDefaultDraft(),
        eventSlug,
      }
    }
  }

  function patch(values: Partial<ContributionDraft>) {
    draft.value = {
      ...draft.value,
      ...values,
    }
  }

  function reset() {
    draft.value = createDefaultDraft()
  }

  return {
    draft,
    initialise,
    patch,
    reset,
  }
})
