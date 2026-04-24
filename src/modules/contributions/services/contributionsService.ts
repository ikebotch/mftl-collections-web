import { httpClient } from '@/core/api/httpClient'
import type { RequestOptions } from '@/core/api/types'
import type { ContributionRow } from '../types/contribution'

export interface CashContributionResult {
  contributionId: string
  receiptId: string | null
  status: string
}

export interface CashContributionResultDto {
  contributionId?: string
  receiptId?: string | null
  status?: string
  ContributionId?: string
  ReceiptId?: string | null
  Status?: string
}

export interface RecordCashContributionInput {
  eventId: string
  recipientFundId: string
  amount: number
  currency: string
  contributorName?: string
  contributorPhone: string
  contributorEmail?: string
  anonymous: boolean
  paymentMethod: string
  note?: string
}

function mapCashContributionResult(dto: CashContributionResultDto): CashContributionResult {
  return {
    contributionId: dto.contributionId ?? dto.ContributionId ?? '',
    receiptId: dto.receiptId ?? dto.ReceiptId ?? null,
    status: dto.status ?? dto.Status ?? '',
  }
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

export async function recordCashContribution(
  payload: RecordCashContributionInput,
  options?: RequestOptions,
): Promise<CashContributionResult> {
  const response = await httpClient.post<CashContributionResultDto, RecordCashContributionInput>(
    '/contributions/cash',
    payload,
    options,
  )
  return mapCashContributionResult(response.data)
}

export const contributionsService = {
  list: listContributions,
  recordCash: recordCashContribution,
}
