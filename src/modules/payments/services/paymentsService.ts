import { httpClient } from '@/core/api/httpClient'
import { mapPaymentDto } from '../mappers/paymentsMappers'
import type { PaymentDto, PaymentRow } from '../types/payment'

export interface InitiatePaymentInput {
  contributionId: string
  provider: 'stripe' | 'test'
}

export async function listPayments(): Promise<PaymentRow[]> {
  const response = await httpClient.get<PaymentDto[]>('/payments')
  return (response.data || []).map(mapPaymentDto)
}

export async function initiatePayment(payload: InitiatePaymentInput): Promise<{ paymentUrl: string }> {
  const response = await httpClient.post<{ paymentUrl: string }, InitiatePaymentInput>(
    '/payments/initiate',
    payload,
  )
  return response.data
}

export const paymentsService = {
  list: listPayments,
  initiate: initiatePayment,
}
