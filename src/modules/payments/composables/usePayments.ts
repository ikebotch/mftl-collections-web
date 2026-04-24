import { useQuery } from '@tanstack/vue-query'
import { listPayments } from '../services/paymentsService'
import type { PaymentRow } from '../types/payment'
import type { ApiError } from '@/core/api/apiError'

export function usePayments() {
  return useQuery<PaymentRow[], ApiError>({
    queryKey: ['payments'],
    queryFn: listPayments,
  })
}
