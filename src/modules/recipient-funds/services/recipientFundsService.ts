import { httpClient } from '@/core/api/httpClient'
import type { CreateRecipientFundInput, RecipientFund, RecipientFundDto } from '../types/recipientFund'
import { mapRecipientFundDto } from '../mappers/recipientFundMappers'

export const recipientFundsService = {
  async list(): Promise<RecipientFund[]> {
    const response = await httpClient.get<RecipientFundDto[]>('/recipient-funds')
    return response.data.map(mapRecipientFundDto)
  },
  async getById(id: string): Promise<RecipientFund> {
    const response = await httpClient.get<RecipientFundDto>(`/recipient-funds/${id}`)
    return mapRecipientFundDto(response.data)
  },
  async listByEvent(eventId: string): Promise<RecipientFund[]> {
    const response = await httpClient.get<RecipientFundDto[]>(`/recipient-funds/event/${eventId}`)
    return response.data.map(mapRecipientFundDto)
  },
  async create(payload: CreateRecipientFundInput): Promise<RecipientFund> {
    const response = await httpClient.post<RecipientFundDto | string, CreateRecipientFundInput>(
      '/recipient-funds',
      payload,
    )

    if (typeof response.data === 'string') {
      return {
        id: response.data,
        eventId: payload.eventId,
        name: payload.name,
        description: payload.description,
        targetAmount: payload.targetAmount,
        receivedAmount: 0,
        currency: 'GBP',
      }
    }

    return mapRecipientFundDto(response.data)
  },
  async update(id: string, payload: CreateRecipientFundInput): Promise<void> {
    await httpClient.put<void, CreateRecipientFundInput>(`/recipient-funds/${id}`, payload)
  },
}
