import { httpClient } from '@/core/api/httpClient'
import type { CreateRecipientFundInput, RecipientFund, RecipientFundDto } from '../types/recipientFund'
import { mapRecipientFundDto } from '../mappers/recipientFundMappers'

export const recipientFundsService = {
  async listByEvent(eventId: string): Promise<RecipientFund[]> {
    const response = await httpClient.get<RecipientFundDto[]>(`/recipient-funds/event/${eventId}`)
    return response.data.map(mapRecipientFundDto)
  },
  async create(payload: CreateRecipientFundInput): Promise<RecipientFund> {
    const response = await httpClient.post<RecipientFundDto, CreateRecipientFundInput>(
      '/recipient-funds',
      payload,
    )
    return mapRecipientFundDto(response.data)
  },
}
