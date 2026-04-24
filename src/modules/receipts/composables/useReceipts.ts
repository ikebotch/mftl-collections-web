import { useQuery } from '@tanstack/vue-query'
import { getReceiptById, listReceipts } from '../services/receiptsService'
import type { ReceiptDetail, ReceiptRow } from '../types/receipt'
import type { ApiError } from '@/core/api/apiError'

export function useReceipts() {
  return useQuery<ReceiptRow[], ApiError>({
    queryKey: ['receipts'],
    queryFn: listReceipts,
  })
}

export function useReceipt(id: string) {
  return useQuery<ReceiptDetail, ApiError>({
    queryKey: ['receipts', id],
    queryFn: () => getReceiptById(id),
    enabled: Boolean(id),
  })
}
