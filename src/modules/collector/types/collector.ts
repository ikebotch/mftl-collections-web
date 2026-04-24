export interface CollectorProfileDto {
  id: string
  name: string
  email: string
  status: string
  assignedEventCount: number
  assignedFundCount: number
  totalCollectedToday: number
  receiptsIssuedToday: number
  lastActiveAt: string | null
  hasAssignments: boolean
  blockedReason?: string | null
}

export interface CollectorAssignedEventDto {
  id: string
  title: string
  description: string
  status: string
  eventDate: string | null
  location: string
  assignedFundCount: number
}

export interface CollectorAssignedFundDto {
  id: string
  eventId: string
  name: string
  description: string
  targetAmount: number
  collectedAmount: number
  currency: string
}

export interface CollectorAssignmentsDto {
  hasAssignments: boolean
  blockedReason?: string | null
  events: CollectorAssignedEventDto[]
  funds: CollectorAssignedFundDto[]
}

export interface CollectorHistoryReceiptDto {
  id: string
  receiptNumber: string
  status: string
  issuedAt: string
  eventTitle: string
  recipientFundName: string
  amount: number
  currency: string
  contributorName: string
  contributionStatus: string
  paymentStatus: string
  paymentMethod: string
}

export interface CollectorProfile {
  id: string
  name: string
  email: string
  status: string
  assignedEventCount: number
  assignedFundCount: number
  totalCollectedToday: number
  receiptsIssuedToday: number
  lastActiveAt: string | null
  hasAssignments: boolean
  blockedReason: string
}

export interface CollectorAssignedEvent {
  id: string
  title: string
  description: string
  status: string
  eventDate: string | null
  dateLabel: string
  location: string
  assignedFundCount: number
}

export interface CollectorAssignedFund {
  id: string
  eventId: string
  name: string
  description: string
  targetAmount: number
  collectedAmount: number
  currency: string
  progress: number
}

export interface CollectorAssignments {
  hasAssignments: boolean
  blockedReason: string
  events: CollectorAssignedEvent[]
  funds: CollectorAssignedFund[]
}

export interface CollectorHistoryReceipt {
  id: string
  receiptNumber: string
  status: string
  issuedAt: string
  eventTitle: string
  recipientFundName: string
  amount: string
  amountValue: number
  currency: string
  contributorName: string
  contributionStatus: string
  paymentStatus: string
  paymentMethod: string
}

export interface CollectorDashboardSummary {
  profile: CollectorProfile
  assignments: CollectorAssignments
  todayTotal: string
  receiptsIssued: number
  assignedEvents: number
  assignedFunds: number
  currentShiftLabel: string
  syncStatusLabel: string
  syncStatusDescription: string
  recentReceipts: CollectorHistoryReceipt[]
}
