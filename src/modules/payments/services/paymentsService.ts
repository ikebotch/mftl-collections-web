import { httpClient } from '@/core/api/httpClient'
import type { PaymentRow } from '../types/payment'

export interface InitiatePaymentInput {
  contributionId: string
  provider: 'stripe' | 'test'
}

export async function listPayments(): Promise<PaymentRow[]> {
  const response = await httpClient.get<PaymentRow[]>('/payments')
  return response.data || []
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
