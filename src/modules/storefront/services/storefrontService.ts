import { httpClient } from '@/core/api/httpClient'
import type { StorefrontEvent } from '../types/storefront'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'

export async function getStorefrontEvent(eventSlug: string): Promise<StorefrontEvent> {
  const response = await httpClient.get<StorefrontEvent>(`public/events/${eventSlug}`, { skipAuth: true })
  return response.data
}

export async function getStorefrontRecipientFunds(eventSlug: string): Promise<RecipientFund[]> {
  const response = await httpClient.get<RecipientFund[]>(`public/events/${eventSlug}/recipient-funds`, { skipAuth: true })
  return response.data
}

export async function initiatePublicContribution(payload: any) {
  const response = await httpClient.post<any>('public/contributions/initiate', payload, { skipAuth: true })
  return response.data
}

export async function getPublicPaymentStatus(paymentId: string) {
  const response = await httpClient.get<any>(`public/payments/${paymentId}/status`, { skipAuth: true })
  return response.data
}

export async function getPublicReceipt(receiptId: string) {
  const response = await httpClient.get<any>(`public/receipts/${receiptId}`, { skipAuth: true })
  return response.data
}
