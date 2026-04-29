import { httpClient } from '@/core/api/httpClient'
import type { RequestOptions, PagedResponse } from '@/core/api/types'
import { formatCurrency, formatDate } from '@/core/formatting/formatters'
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
  pin: string
}

interface ContributionListItemDto {
  id?: string
  Id?: string
  createdAt?: string
  CreatedAt?: string
  eventTitle?: string
  EventTitle?: string
  recipientFundName?: string
  RecipientFundName?: string
  paymentMethod?: string
  PaymentMethod?: string
  status?: string
  Status?: string
  amount?: number
  Amount?: number
  currency?: string
  Currency?: string
  contributorName?: string
  ContributorName?: string
  contributorPhone?: string
  ContributorPhone?: string
  contributorEmail?: string
  ContributorEmail?: string
  receiptId?: string | null
  ReceiptId?: string | null
  collectorName?: string | null
  CollectorName?: string | null
  note?: string | null
  Note?: string | null
}

function mapCashContributionResult(dto: CashContributionResultDto): CashContributionResult {
  return {
    contributionId: dto.contributionId ?? dto.ContributionId ?? '',
    receiptId: dto.receiptId ?? dto.ReceiptId ?? null,
    status: dto.status ?? dto.Status ?? '',
  }
}

function mapContributionRow(dto: ContributionListItemDto): ContributionRow {
  const amount = dto.amount ?? dto.Amount ?? 0
  const currency = dto.currency ?? dto.Currency ?? 'GHS'

  return {
    id: dto.id ?? dto.Id ?? '',
    date: formatDate(dto.createdAt ?? dto.CreatedAt),
    event: dto.eventTitle ?? dto.EventTitle ?? 'Unknown event',
    recipientFund: dto.recipientFundName ?? dto.RecipientFundName ?? 'Unknown fund',
    paymentMethod: dto.paymentMethod ?? dto.PaymentMethod ?? 'Unknown',
    status: dto.status ?? dto.Status ?? 'Unknown',
    amount: formatCurrency(amount, currency),
    amountValue: amount,
    currency,
    contributorName: dto.contributorName ?? dto.ContributorName ?? 'Anonymous',
    contributorPhone: dto.contributorPhone ?? dto.ContributorPhone ?? '',
    contributorEmail: dto.contributorEmail ?? dto.ContributorEmail,
    receiptId: dto.receiptId ?? dto.ReceiptId ?? null,
    collectorName: dto.collectorName ?? dto.CollectorName ?? null,
    note: dto.note ?? dto.Note ?? null,
  }
}

export async function listContributions(params?: { 
  page?: number, 
  pageSize?: number,
  branchId?: string,
  tenantId?: string
}): Promise<PagedResponse<ContributionRow>> {
  try {
    const response = await httpClient.get<PagedResponse<ContributionListItemDto>>('/contributions', { params })
    const paged = response.data
    
    return {
      ...paged,
      items: (paged.items || []).map(mapContributionRow)
    }
  } catch (error) {
    console.warn('Contributions list endpoint error:', error)
    return {
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    }
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

export async function getContributionById(id: string): Promise<ContributionRow> {
  const response = await httpClient.get<ContributionListItemDto>(`/contributions/${id}`)
  return mapContributionRow(response.data)
}

export async function updateContribution(id: string, payload: any): Promise<boolean> {
  const response = await httpClient.put<boolean, any>(`/contributions/${id}`, payload)
  return response.data
}

export const contributionsService = {
  list: listContributions,
  getById: getContributionById,
  recordCash: recordCashContribution,
  update: updateContribution,
}
