import type { SettlementRow } from '../types/settlement'

export async function listSettlements(): Promise<SettlementRow[]> {
  return [
    { id: 'set-1', summary: 'Weekly reconciliation batch', status: 'Pending review' },
  ]
}
