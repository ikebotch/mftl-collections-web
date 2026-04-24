import { useQuery } from '@tanstack/vue-query'
import { listPayments } from '../services/paymentsService'

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: listPayments,
  })
}
