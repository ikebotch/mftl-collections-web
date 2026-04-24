import type { RecipientFund, RecipientFundDto } from '../types/recipientFund'

export function mapRecipientFundDto(dto: RecipientFundDto): RecipientFund {
  const id = dto.id ?? (dto as RecipientFundDto & { Id?: string }).Id ?? ''
  const eventId = dto.eventId ?? (dto as RecipientFundDto & { EventId?: string }).EventId ?? ''
  const name = dto.name ?? (dto as RecipientFundDto & { Name?: string }).Name ?? ''
  const description =
    dto.description ?? (dto as RecipientFundDto & { Description?: string }).Description ?? ''
  const targetAmount =
    dto.targetAmount ??
    (dto as RecipientFundDto & { TargetAmount?: number }).TargetAmount ??
    0
  const collectedAmount =
    dto.collectedAmount ??
    (dto as RecipientFundDto & { CollectedAmount?: number }).CollectedAmount ??
    0

  return {
    id,
    eventId,
    name,
    description,
    targetAmount,
    receivedAmount: collectedAmount,
    currency: 'GBP',
  }
}
