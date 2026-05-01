import { httpClient } from '@/core/api/httpClient'
import { mapPaymentDto } from '../mappers/paymentsMappers'
import type { PaymentDto, PaymentRow } from '../types/payment'

export interface InitiatePaymentInput {
  contributionId: string
  provider: 'stripe' | 'paystack' | 'test'
}

export interface PaymentResult {
  success: boolean
  checkoutUrl?: string
  providerReference?: string
}

export async function listPayments(): Promise<PaymentRow[]> {
  const response = await httpClient.get<PaymentDto[]>('/payments')
  return (response.data || []).map(mapPaymentDto)
}

export async function initiatePayment(payload: InitiatePaymentInput): Promise<PaymentResult> {
  const response = await httpClient.post<PaymentResult, InitiatePaymentInput>(
    '/payments/initiate',
    payload,
  )
  return response.data
}

export const paymentsService = {
  list: listPayments,
  initiate: initiatePayment,
}
