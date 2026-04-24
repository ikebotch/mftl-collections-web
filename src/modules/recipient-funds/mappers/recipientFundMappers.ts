import type { RecipientFund, RecipientFundDto } from '../types/recipientFund'

export function mapRecipientFundDto(dto: RecipientFundDto): RecipientFund {
  return {
    id: dto.id,
    eventId: dto.eventId,
    name: dto.name,
    description: dto.description,
    targetAmount: dto.targetAmount,
    receivedAmount: dto.collectedAmount,
    currency: 'GBP',
  }
}
