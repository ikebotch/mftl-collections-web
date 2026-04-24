import type { CollectorEventRow, CollectorReceipt } from '../types/collector'

export async function listAssignedEvents(): Promise<CollectorEventRow[]> {
  return [
    { id: 'event-1', title: 'Community fundraiser', location: 'Main hall', shift: '09:00 - 12:00' },
    { id: 'event-2', title: 'Evening appeal', location: 'Reception desk', shift: '18:00 - 20:00' },
  ]
}

export async function getCollectorDashboard() {
  return {
    todayCollections: 'GBP 0.00',
    receiptsIssued: '0',
    assignedEvents: '2',
  }
}

export async function listCollectorHistory(): Promise<CollectorReceipt[]> {
  return [
    { id: 'receipt-22', amount: 'GBP 45.00', status: 'Printed placeholder' },
  ]
}
