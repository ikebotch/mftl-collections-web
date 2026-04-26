import { httpClient } from '@/core/api/httpClient'

export interface SettlementRow {
  id: string
  collectorName: string
  amount: number
  currency: string
  status: string
  date: string
  note?: string
}

export async function listSettlements(): Promise<SettlementRow[]> {
  const response = await httpClient.get<SettlementRow[]>('settlements')
  return response.data
}

export const settlementsService = {
  list: listSettlements,
}
