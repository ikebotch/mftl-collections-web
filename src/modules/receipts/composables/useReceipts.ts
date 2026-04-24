import { useQuery } from '@tanstack/vue-query'
import { listReceipts } from '../services/receiptsService'

export function useReceipts() {
  return useQuery({
    queryKey: ['receipts'],
    queryFn: listReceipts,
  })
}
