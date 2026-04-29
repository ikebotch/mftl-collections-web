import { httpClient } from '@/core/api/httpClient'
import { mapReceiptDetail, mapReceiptListItem } from '../mappers/receiptsMappers'
import type { ReceiptDetail, ReceiptDto, ReceiptListItemDto, ReceiptRow } from '../types/receipt'

export async function listReceipts(): Promise<ReceiptRow[]> {
  const response = await httpClient.get<ReceiptListItemDto[]>('/receipts')
  return (response.data || []).map(mapReceiptListItem)
}

export async function getReceiptById(id: string): Promise<ReceiptDetail> {
  const response = await httpClient.get<ReceiptDto>(`/receipts/${id}`)
  return mapReceiptDetail(response.data)
}

export async function resendReceipt(id: string): Promise<void> {
  await httpClient.post(`/receipts/${id}/resend`)
}

export const receiptsService = {
  list: listReceipts,
  getById: getReceiptById,
  resend: resendReceipt,
}
