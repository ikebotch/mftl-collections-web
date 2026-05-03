import { useQuery } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { getStorefrontEvent, getStorefrontRecipientFunds } from '../services/storefrontService'
import type { StorefrontEvent } from '../types/storefront'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'

export function useStorefrontEvent(eventSlug: MaybeRefOrGetter<string>) {
  return useQuery<StorefrontEvent>({
    queryKey: ['storefront-event', () => toValue(eventSlug)],
    queryFn: () => getStorefrontEvent(toValue(eventSlug)),
    enabled: () => Boolean(toValue(eventSlug)),
  })
}

export function useStorefrontRecipientFunds(eventSlug: MaybeRefOrGetter<string>) {
  return useQuery<RecipientFund[]>({
    queryKey: ['storefront-recipient-funds', () => toValue(eventSlug)],
    queryFn: () => getStorefrontRecipientFunds(toValue(eventSlug)),
    enabled: () => Boolean(toValue(eventSlug)),
  })
}
