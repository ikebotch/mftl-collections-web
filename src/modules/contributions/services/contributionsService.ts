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
  const response = await httpClient.get<ContributionRow[]>('/contributions')
  return response.data || []
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
