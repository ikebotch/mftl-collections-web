import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ContributionDraft } from '../types/storefront'

const STORAGE_KEY = 'mftl_contribution_draft'

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

function loadPersistedDraft(): ContributionDraft | null {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export const useContributionFlowStore = defineStore('contribution-flow', () => {
  const draft = ref<ContributionDraft>(loadPersistedDraft() || createDefaultDraft())

  // Persist changes
  watch(draft, (newDraft) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDraft))
  }, { deep: true })

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
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    draft,
    initialise,
    patch,
    reset,
  }
})
