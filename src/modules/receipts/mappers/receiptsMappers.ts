import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import type { ReceiptDetail, ReceiptDto, ReceiptListItemDto, ReceiptRow } from '../types/receipt'

export function mapReceiptStatus(status: string): string {
  return status || 'Unknown'
}

export function mapReceiptListItem(dto: ReceiptListItemDto): ReceiptRow {
  const amount = dto.amount ?? dto.Amount ?? 0
  const currency = dto.currency ?? dto.Currency ?? 'GBP'

  return {
    id: dto.id ?? dto.Id ?? '',
    receiptNumber: dto.receiptNumber ?? dto.ReceiptNumber ?? '',
    status: mapReceiptStatus(dto.status ?? dto.Status ?? ''),
    issuedAt: formatDate(dto.issuedAt ?? dto.IssuedAt ?? null),
    eventTitle: dto.eventTitle ?? dto.EventTitle ?? 'Unknown event',
    recipientFundName: dto.recipientFundName ?? dto.RecipientFundName ?? 'Unknown fund',
    amount: formatCurrency(amount, currency),
    contributorName: dto.contributorName ?? dto.ContributorName ?? 'Anonymous',
    contributionStatus: dto.contributionStatus ?? dto.ContributionStatus ?? 'Unknown',
    paymentStatus: dto.paymentStatus ?? dto.PaymentStatus ?? 'Unknown',
    paymentMethod: dto.paymentMethod ?? dto.PaymentMethod ?? 'Unknown',
  }
}

export function mapReceiptDetail(dto: ReceiptDto): ReceiptDetail {
  const summary = mapReceiptListItem(dto)

  return {
    ...summary,
    tenantId: dto.tenantId ?? dto.TenantId ?? '',
    eventId: dto.eventId ?? dto.EventId ?? '',
    recipientFundId: dto.recipientFundId ?? dto.RecipientFundId ?? '',
    contributionId: dto.contributionId ?? dto.ContributionId ?? '',
    paymentId: dto.paymentId ?? dto.PaymentId ?? null,
    recordedByUserId: dto.recordedByUserId ?? dto.RecordedByUserId ?? null,
    contributorPhone: dto.contributorPhone ?? dto.ContributorPhone ?? '',
    contributorEmail: dto.contributorEmail ?? dto.ContributorEmail ?? '',
    isAnonymous: dto.isAnonymous ?? dto.IsAnonymous ?? false,
    collectorName: dto.collectorName ?? dto.CollectorName ?? '',
    note: dto.note ?? dto.Note ?? '',
  }
}
