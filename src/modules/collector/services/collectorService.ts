import { eventsService } from '@/modules/events/services/eventsService'
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
  // Placeholder until history endpoint is ready
  return []
}

export const collectorService = {
  listAssignedEvents,
  getCollectorDashboard,
  listCollectorHistory,
}
