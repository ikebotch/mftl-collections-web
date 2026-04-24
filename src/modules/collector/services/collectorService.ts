import { httpClient } from '@/core/api/httpClient'
import { eventsService } from '@/modules/events/services/eventsService'
import { listReceipts } from '@/modules/receipts/services/receiptsService'
import type { CollectorEventRow, CollectorReceipt, CollectorRow, CollectorDto, CreateCollectorInput } from '../types/collector'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'

export async function listCollectors(): Promise<CollectorRow[]> {
  const response = await httpClient.get<CollectorDto[]>('/collectors')
  const data = response.data || []
  
  return data.map(dto => ({
    id: dto.id,
    name: dto.name,
    email: dto.email,
    status: dto.status,
    activeEvents: dto.assignedEventCount,
    totalCollected: formatCurrency(dto.totalCollectedMonth, 'GHS'),
    lastActive: dto.lastActiveAt ? formatDate(dto.lastActiveAt) : 'Never',
    type: 'Staff' // Fixed for now
  }))
}

export async function createCollector(payload: CreateCollectorInput): Promise<CollectorRow> {
  const response = await httpClient.post<CollectorDto, CreateCollectorInput>('/collectors', payload)
  const dto = response.data
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    status: dto.status,
    activeEvents: dto.assignedEventCount,
    totalCollected: formatCurrency(dto.totalCollectedMonth, 'GHS'),
    lastActive: dto.lastActiveAt ? formatDate(dto.lastActiveAt) : 'New',
    type: 'Staff'
  }
}

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
    todayCollections: 'GHS 0.00',
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
  list: listCollectors,
  create: createCollector,
  listAssignedEvents,
  getCollectorDashboard,
  listCollectorHistory,
}
