import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ContributionDraft } from '../types/storefront'
import { createStorefrontContribution } from '../services/storefrontService'
import { initiatePayment } from '@/modules/payments/services/paymentsService'

function createDefaultDraft(): ContributionDraft & { eventId: string } {
  return {
    eventId: '',
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
  const draft = ref(createDefaultDraft())
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  function initialise(eventSlug: string, eventId?: string) {
    if (draft.value.eventSlug !== eventSlug) {
      draft.value = {
        ...createDefaultDraft(),
        eventSlug,
        eventId: eventId ?? '',
      }
    } else if (eventId && !draft.value.eventId) {
      draft.value.eventId = eventId
    }
  }

  async function submit() {
    if (isSubmitting.value) return
    isSubmitting.value = true
    error.value = null

    try {
      // 1. Create Contribution
      const contribution = await createStorefrontContribution({
        eventId: draft.value.eventId,
        recipientFundId: draft.value.recipientFundId,
        amount: draft.value.amount,
        currency: 'GHS', // Default for now
        contributorName: draft.value.contributorName,
        contributorPhone: draft.value.contributorPhone,
        contributorEmail: draft.value.contributorEmail,
        anonymous: draft.value.anonymous,
        paymentMethod: draft.value.paymentMethod,
        note: draft.value.note,
      })

      // 2. Initiate Payment
      const payment = await initiatePayment({
        contributionId: contribution.id,
        provider: draft.value.paymentMethod === 'card' ? 'stripe' : 'paystack', // Map appropriately
      })

      // 3. Redirect to Checkout
      if (payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl
      } else {
        throw new Error('No checkout URL returned from payment service.')
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to initiate contribution.'
      isSubmitting.value = false
      throw e
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
    isSubmitting,
    error,
    initialise,
    patch,
    reset,
    submit,
  }
})
