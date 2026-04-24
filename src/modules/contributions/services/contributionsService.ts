import { httpClient } from '@/core/api/httpClient'
import type { ContributionRow } from '../types/contribution'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'

export interface ContributionListItemDto {
  id?: string
  createdAt?: string
  eventTitle?: string
  recipientFundName?: string
  paymentMethod?: string
  status?: string
  amount?: number
  currency?: string
  Id?: string
  CreatedAt?: string
  EventTitle?: string
  RecipientFundName?: string
  PaymentMethod?: string
  Status?: string
  Amount?: number
  Currency?: string
}

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
  contributorName?: string
  note?: string
}

function mapCashContributionResult(dto: CashContributionResultDto): CashContributionResult {
  return {
    contributionId: dto.contributionId ?? dto.ContributionId ?? '',
    receiptId: dto.receiptId ?? dto.ReceiptId ?? null,
    status: dto.status ?? dto.Status ?? '',
  }
}

function mapContributionListItem(dto: ContributionListItemDto): ContributionRow {
  const amount = dto.amount ?? dto.Amount ?? 0
  const currency = dto.currency ?? dto.Currency ?? 'GBP'

  return {
    id: dto.id ?? dto.Id ?? '',
    date: formatDate(dto.createdAt ?? dto.CreatedAt ?? null),
    event: dto.eventTitle ?? dto.EventTitle ?? 'Unknown event',
    recipientFund: dto.recipientFundName ?? dto.RecipientFundName ?? 'Unknown fund',
    paymentMethod: dto.paymentMethod ?? dto.PaymentMethod ?? 'Unknown',
    status: dto.status ?? dto.Status ?? 'Unknown',
    amount: formatCurrency(amount, currency),
  }
}

export async function listContributions(): Promise<ContributionRow[]> {
  const response = await httpClient.get<ContributionListItemDto[]>('/contributions')
  return (response.data ?? []).map(mapContributionListItem)
}

export async function recordCashContribution(payload: RecordCashContributionInput): Promise<CashContributionResult> {
  const response = await httpClient.post<CashContributionResultDto, RecordCashContributionInput>(
    '/contributions/cash',
    payload,
  )
  return mapCashContributionResult(response.data)
}

export const contributionsService = {
  list: listContributions,
  recordCash: recordCashContribution,
}
