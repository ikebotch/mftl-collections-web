import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ContributionDraft } from '../types/storefront'
import { createStorefrontContribution } from '../services/storefrontService'
import { useRouter } from 'vue-router'

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
    donorNetwork: '',
  }
}

export const useContributionFlowStore = defineStore('contribution-flow', () => {
  const router = useRouter()
  const draft = ref(createDefaultDraft())
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)
  const result = ref<any>(null)

  function initialise(eventSlug: string) {
    if (draft.value.eventSlug !== eventSlug) {
      draft.value = {
        ...createDefaultDraft(),
        eventSlug,
      }
    }
  }

  async function submit(slug?: string) {
    if (isSubmitting.value) return
    
    // Recovery: use provided slug or fall back to draft
    const finalSlug = (slug || draft.value.eventSlug || '').trim()
    
    if (!finalSlug) {
      error.value = "Missing giving link. Please restart from the giving page."
      return
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug("Submitting storefront contribution", { slug: finalSlug })
    }

    isSubmitting.value = true
    error.value = null

    try {
      // Create Storefront Contribution (Backend now initiates payment internally)
      const res = await createStorefrontContribution(finalSlug, {
        recipientFundId: draft.value.recipientFundId,
        amount: draft.value.amount,
        currency: 'GHS', // Default for now
        donorName: draft.value.contributorName,
        donorPhone: draft.value.contributorPhone,
        donorEmail: draft.value.contributorEmail,
        anonymous: draft.value.anonymous,
        paymentMethod: draft.value.paymentMethod,
        donorNetwork: draft.value.donorNetwork,
        note: draft.value.note,
      })

      result.value = res

      const checkoutUrl = res.checkoutUrl || res.redirectUrl

      if (checkoutUrl) {
        window.location.assign(checkoutUrl)
      } else if (res.contributionId && (res.paymentId || res.providerReference)) {
        // MoMo case usually returns no checkout URL but has a payment record
        router.push({
          name: 'storefront-pending',
          params: { eventSlug: finalSlug, id: res.contributionId }
        })
      } else {
        throw new Error('Payment initiation failed: No checkout URL or payment reference returned.')
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to initiate contribution.'
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
