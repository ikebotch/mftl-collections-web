import { eventsService } from '@/modules/events/services/eventsService'
import { listReceipts } from '@/modules/receipts/services/receiptsService'
import type { CollectorEventRow, CollectorReceipt } from '../types/collector'

export async function listAssignedEvents(): Promise<CollectorEventRow[]> {
  // For now, collectors see all events until assigned events endpoint is ready
  const events = await eventsService.list()
  return events.map(e => ({
    id: e.id,
    title: e.title,
    location: 'Main Site', // Placeholder
    shift: 'All Day', // Placeholder
  }))
}

export async function getCollectorDashboard() {
  // This will eventually be a real endpoint
  const events = await listAssignedEvents()
  return {
    todayCollections: 'GBP 0.00',
    receiptsIssued: '0',
    assignedEvents: String(events.length),
  }
}

export async function listCollectorHistory(): Promise<CollectorReceipt[]> {
  const receipts = await listReceipts()
  return receipts.map(receipt => ({
    id: receipt.id,
    amount: receipt.amount,
    status: receipt.status,
    receiptNumber: receipt.receiptNumber,
  }))
}

export const collectorService = {
  listAssignedEvents,
  getCollectorDashboard,
  listCollectorHistory,
}
