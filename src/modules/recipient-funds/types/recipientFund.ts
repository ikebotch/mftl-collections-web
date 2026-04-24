export interface RecipientFundDto {
  id: string
  eventId: string
  name: string
  description: string
  targetAmount: number
  collectedAmount: number
}

export interface RecipientFund {
  id: string
  eventId: string
  name: string
  description: string
  targetAmount: number
  receivedAmount: number
  currency: string
}

export interface CreateRecipientFundInput {
  eventId: string
  name: string
  description: string
  targetAmount: number
}
