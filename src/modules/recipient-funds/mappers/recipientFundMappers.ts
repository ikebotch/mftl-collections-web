import type { RecipientFund, RecipientFundDto } from '../types/recipientFund'

export function mapRecipientFundDto(dto: RecipientFundDto): RecipientFund {
  const id = dto.id ?? ''
  const eventId = dto.eventId ?? ''
  const name = dto.name ?? ''
  const description = dto.description ?? ''
  const targetAmount = dto.targetAmount ?? 0
  
  const ghsTotal = dto.totals?.find(t => t.currency === 'GHS')?.amount ?? 0

  return {
    id,
    eventId,
    name,
    description,
    targetAmount,
    totals: dto.totals ?? [],
    receivedAmount: ghsTotal, // Default to GHS for legacy views
    currency: 'GHS'
  }
}
