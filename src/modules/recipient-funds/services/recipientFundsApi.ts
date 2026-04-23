import httpClient, { type ApiResponse } from '../../../core/api/httpClient'
import type { RecipientFund, CreateRecipientFundRequest } from '../models/recipientFund'

export const recipientFundsApi = {
  async getFundsByEvent(eventId: string): Promise<RecipientFund[]> {
    const response = await httpClient.get<ApiResponse<RecipientFund[]>>(`/v1/recipient-funds/event/${eventId}`)
    return response.data.data ?? []
  },

  async createFund(data: CreateRecipientFundRequest): Promise<RecipientFund> {
    const response = await httpClient.post<ApiResponse<RecipientFund>>('/v1/recipient-funds', data)
    return response.data.data!
  }
}
