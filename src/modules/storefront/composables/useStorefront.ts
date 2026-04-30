import { useQuery } from '@tanstack/vue-query'
import { getStorefrontEvent, getStorefrontRecipientFunds } from '../services/storefrontService'
import type { StorefrontEvent } from '../types/storefront'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'

export function useStorefrontEvent(eventSlug: string) {
  return useQuery<StorefrontEvent>({
    queryKey: ['storefront-event', eventSlug],
    queryFn: () => getStorefrontEvent(eventSlug),
    enabled: Boolean(eventSlug),
  })
}

export function useStorefrontRecipientFunds(eventSlug: string) {
  return useQuery<RecipientFund[]>({
    queryKey: ['storefront-recipient-funds', eventSlug],
    queryFn: () => getStorefrontRecipientFunds(eventSlug),
    enabled: Boolean(eventSlug),
  })
}
