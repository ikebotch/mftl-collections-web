import type { CurrencyTotal } from '@/modules/events/types/event'

export interface RecipientFundDto {
  id: string
  eventId: string
  name: string
  description: string
  targetAmount: number
  totals?: CurrencyTotal[]
}

export interface RecipientFund extends RecipientFundDto {
  receivedAmount: number 
  currency: string // Legacy support for single-currency views
}

export interface CreateRecipientFundInput {
  eventId: string
  name: string
  description: string
  targetAmount: number
}
