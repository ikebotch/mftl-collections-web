import { httpClient } from '@/core/api/httpClient'
import type { CollectorAssignmentDto, CollectorMeDto, CollectorReceipt, CollectorRow, CollectorDto, CreateCollectorInput } from '../types/collector'
import type { ReceiptListItemDto } from '@/modules/receipts/types/receipt'
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
    type: 'Staff'
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

export async function getCollectorMe(): Promise<CollectorMeDto> {
  const response = await httpClient.get<CollectorMeDto>('/collector/me')
  return response.data
}

export async function listAssignments(): Promise<CollectorAssignmentDto[]> {
  const response = await httpClient.get<CollectorAssignmentDto[]>('/collector/assignments')
  return response.data || []
}

export async function listCollectorHistory(): Promise<CollectorReceipt[]> {
  const response = await httpClient.get<ReceiptListItemDto[]>('/collector/history')
  const data = response.data || []
  
  return data.map(receipt => ({
    id: receipt.id || '',
    amount: formatCurrency(receipt.amount || 0, receipt.currency || 'GHS'),
    status: receipt.status || 'Unknown',
    receiptNumber: receipt.receiptNumber || '---',
    eventTitle: receipt.eventTitle,
    date: receipt.issuedAt ? formatDate(receipt.issuedAt) : '---'
  }))
}

export const collectorService = {
  list: listCollectors,
  create: createCollector,
  getMe: getCollectorMe,
  listAssignments,
  listCollectorHistory,
}
