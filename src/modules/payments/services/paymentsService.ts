import type { PaymentRow } from '../types/payment'

export async function listPayments(): Promise<PaymentRow[]> {
  return [
    {
      id: 'pay-1',
      providerReference: 'ref-placeholder',
      method: 'card',
      status: 'Pending',
      amount: 'GBP 50.00',
    },
  ]
}
