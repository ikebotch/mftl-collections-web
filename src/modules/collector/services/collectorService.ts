import { httpClient } from '@/core/api/httpClient'
import { shouldBypassAuth } from '@/core/auth/auth0'
import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import type {
  CollectorAssignedEvent,
  CollectorAssignedEventDto,
  CollectorAssignedFund,
  CollectorAssignedFundDto,
  CollectorAssignments,
  CollectorAssignmentsDto,
  CollectorDashboardSummary,
  CollectorHistoryReceipt,
  CollectorHistoryReceiptDto,
  CollectorProfile,
  CollectorProfileDto,
} from '../types/collector'

const DEV_COLLECTOR_ID = 'dev-collector'

function collectorRequestOptions() {
  return shouldBypassAuth()
    ? {
        headers: {
          'X-Dev-User-Id': DEV_COLLECTOR_ID,
        },
      }
    : undefined
}

function mapProfile(dto: CollectorProfileDto): CollectorProfile {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    status: dto.status,
    assignedEventCount: dto.assignedEventCount,
    assignedFundCount: dto.assignedFundCount,
    totalCollectedToday: dto.totalCollectedToday,
    receiptsIssuedToday: dto.receiptsIssuedToday,
    lastActiveAt: dto.lastActiveAt,
    hasAssignments: dto.hasAssignments,
    blockedReason: dto.blockedReason ?? '',
  }
}

function mapAssignedEvent(dto: CollectorAssignedEventDto): CollectorAssignedEvent {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    status: dto.status,
    eventDate: dto.eventDate,
    dateLabel: formatDate(dto.eventDate),
    location: dto.location,
    assignedFundCount: dto.assignedFundCount,
  }
}

function mapAssignedFund(dto: CollectorAssignedFundDto): CollectorAssignedFund {
  const progress = dto.targetAmount > 0 ? Math.min(100, Math.round((dto.collectedAmount / dto.targetAmount) * 100)) : 0

  return {
    id: dto.id,
    eventId: dto.eventId,
    name: dto.name,
    description: dto.description,
    targetAmount: dto.targetAmount,
    collectedAmount: dto.collectedAmount,
    currency: dto.currency,
    progress,
  }
}

function mapAssignments(dto: CollectorAssignmentsDto): CollectorAssignments {
  return {
    hasAssignments: dto.hasAssignments,
    blockedReason: dto.blockedReason ?? '',
    events: dto.events.map(mapAssignedEvent),
    funds: dto.funds.map(mapAssignedFund),
  }
}

function mapHistoryReceipt(dto: CollectorHistoryReceiptDto): CollectorHistoryReceipt {
  return {
    id: dto.id,
    receiptNumber: dto.receiptNumber,
    status: dto.status,
    issuedAt: formatDate(dto.issuedAt),
    eventTitle: dto.eventTitle,
    recipientFundName: dto.recipientFundName,
    amount: formatCurrency(dto.amount, dto.currency),
    amountValue: dto.amount,
    currency: dto.currency,
    contributorName: dto.contributorName,
    contributionStatus: dto.contributionStatus,
    paymentStatus: dto.paymentStatus,
    paymentMethod: dto.paymentMethod,
  }
}

export async function getCollectorProfile(): Promise<CollectorProfile> {
  const response = await httpClient.get<CollectorProfileDto>('/collector/me', collectorRequestOptions())
  return mapProfile(response.data)
}

export async function getCollectorAssignments(): Promise<CollectorAssignments> {
  const response = await httpClient.get<CollectorAssignmentsDto>('/collector/assignments', collectorRequestOptions())
  return mapAssignments(response.data)
}

export async function getCollectorHistory(): Promise<CollectorHistoryReceipt[]> {
  const response = await httpClient.get<CollectorHistoryReceiptDto[]>('/collector/history', collectorRequestOptions())
  return (response.data ?? []).map(mapHistoryReceipt)
}

export async function getCollectorDashboard(): Promise<CollectorDashboardSummary> {
  const [profile, assignments, history] = await Promise.all([
    getCollectorProfile(),
    getCollectorAssignments(),
    getCollectorHistory(),
  ])

  return {
    profile,
    assignments,
    todayTotal: formatCurrency(profile.totalCollectedToday, history[0]?.currency ?? 'GHS'),
    receiptsIssued: profile.receiptsIssuedToday,
    assignedEvents: profile.assignedEventCount,
    assignedFunds: profile.assignedFundCount,
    currentShiftLabel: assignments.events[0]?.location ?? 'No active shift',
    syncStatusLabel: profile.status.toLowerCase() === 'active' ? 'Online' : 'Offline',
    syncStatusDescription: profile.hasAssignments
      ? `Last activity ${profile.lastActiveAt ? formatDate(profile.lastActiveAt) : 'not yet recorded'}`
      : (profile.blockedReason || assignments.blockedReason || 'Assignments are required before collection starts.'),
    recentReceipts: history.slice(0, 5),
  }
}

export async function listAllCollectors(params?: { eventId?: string }): Promise<CollectorProfile[]> {
  const response = await httpClient.get<CollectorProfileDto[]>('/collectors', { params })
  return (response.data ?? []).map(mapProfile)
}

export async function getCollectorById(id: string): Promise<CollectorProfile> {
  const response = await httpClient.get<CollectorProfileDto>(`/collectors/${id}`)
  return mapProfile(response.data)
}

export async function createCollector(payload: any): Promise<CollectorProfile> {
  const response = await httpClient.post<CollectorProfileDto, any>('/collectors', payload)
  return mapProfile(response.data)
}

export async function updateCollector(id: string, payload: any): Promise<void> {
  await httpClient.put(`/collectors/${id}`, payload)
}

export const collectorService = {
  getCollectorProfile,
  getCollectorAssignments,
  getCollectorHistory,
  getCollectorDashboard,
  listAll: listAllCollectors,
  getById: getCollectorById,
  create: createCollector,
  update: updateCollector,
}
