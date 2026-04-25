import { httpClient } from '@/core/api/httpClient'
import type { StorefrontEvent } from '../types/storefront'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'

export async function getStorefrontEvent(eventSlug: string): Promise<StorefrontEvent> {
  const response = await httpClient.get<StorefrontEvent>(`/storefront/events/${eventSlug}`)
  return response.data
}

export async function getStorefrontRecipientFunds(eventSlug: string): Promise<RecipientFund[]> {
  const response = await httpClient.get<RecipientFund[]>(`/storefront/events/${eventSlug}/funds`)
  return response.data
}
