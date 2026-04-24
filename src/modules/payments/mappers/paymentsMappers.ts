import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import type { PaymentDto, PaymentRow } from '../types/payment'

export function mapPaymentStatus(status: string): string {
  return status || 'Unknown'
}

export function mapPaymentDto(dto: PaymentDto): PaymentRow {
  const amount = dto.amount ?? dto.Amount ?? 0
  const currency = dto.currency ?? dto.Currency ?? 'GBP'

  return {
    id: dto.id ?? dto.Id ?? '',
    contributionId: dto.contributionId ?? dto.ContributionId ?? '',
    receiptId: dto.receiptId ?? dto.ReceiptId ?? null,
    providerReference: dto.providerReference ?? dto.ProviderReference ?? 'Pending',
    method: dto.method ?? dto.Method ?? 'Unknown',
    status: mapPaymentStatus(dto.status ?? dto.Status ?? ''),
    amount: formatCurrency(amount, currency),
    createdAt: formatDate(dto.createdAt ?? dto.CreatedAt ?? null),
  }
}
