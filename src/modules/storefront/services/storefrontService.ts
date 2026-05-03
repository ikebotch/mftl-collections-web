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

export interface CreateContributionInput {
  recipientFundId: string
  amount: number
  currency: string
  donorName: string
  donorPhone?: string
  donorEmail?: string
  anonymous: boolean
  paymentMethod: string
  donorNetwork?: string
  note?: string
}

export interface StorefrontContributionResponse {
  contributionId: string
  paymentId?: string
  providerReference?: string
  status: string
  paymentMethod: string
  checkoutUrl?: string
  redirectUrl?: string
}

export interface ContributionStatusDto {
  id: string
  status: string
  reference?: string
  providerReference?: string
  failureReason?: string
}

export async function createStorefrontContribution(slug: string, payload: CreateContributionInput): Promise<StorefrontContributionResponse> {
  if (!slug || !slug.trim()) {
    throw new Error("Missing event slug")
  }
  
  const encodedSlug = encodeURIComponent(slug.trim())
  const response = await httpClient.post<StorefrontContributionResponse>(`/storefront/events/${encodedSlug}/contributions`, payload)
  return response.data
}

export async function getContributionStatus(id: string): Promise<ContributionStatusDto> {
  const response = await httpClient.get<ContributionStatusDto>(`/storefront/contributions/${id}/status`)
  return response.data
}
