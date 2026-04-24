import { httpClient } from '@/core/api/httpClient'
import type { ContributionRow } from '../types/contribution'

export interface RecordCashContributionInput {
  eventId: string
  recipientFundId: string
  amount: number
  contributorName?: string
  note?: string
}

export async function listContributions(): Promise<ContributionRow[]> {
  try {
    const response = await httpClient.get<ContributionRow[]>('/contributions')
    return response.data || []
  } catch (error) {
    // Fallback for not implemented or missing endpoint
    console.warn('Contributions list endpoint error:', error)
    return []
  }
}

export async function recordCashContribution(payload: RecordCashContributionInput): Promise<string> {
  const response = await httpClient.post<string, RecordCashContributionInput>(
    '/contributions/cash',
    payload,
  )
  return response.data
}

export const contributionsService = {
  list: listContributions,
  recordCash: recordCashContribution,
}
