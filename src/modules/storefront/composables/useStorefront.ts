import { useQuery } from '@tanstack/vue-query'
import { getStorefrontEvent, getStorefrontRecipientFunds } from '../services/storefrontService'

export function useStorefrontEvent(eventSlug: string) {
  return useQuery({
    queryKey: ['storefront-event', eventSlug],
    queryFn: () => getStorefrontEvent(eventSlug),
    enabled: Boolean(eventSlug),
  })
}

export function useStorefrontRecipientFunds(eventSlug: string) {
  return useQuery({
    queryKey: ['storefront-recipient-funds', eventSlug],
    queryFn: () => getStorefrontRecipientFunds(eventSlug),
    enabled: Boolean(eventSlug),
  })
}
