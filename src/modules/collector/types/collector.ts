export interface CollectorEventRow {
  id: string
  title: string
  description: string
  eventDate: string
  status: string
}

export interface CollectorReceipt {
  id: string
  amount: string
  status: string
  receiptNumber: string
  issuedAt: string
  contributorName: string
  eventTitle: string
  paymentMethod: string
  contributionStatus: string
  paymentStatus: string
}

export interface CollectorDashboardSummary {
  totalCollected: string
  contributionCount: string
  assignedEvents: string
  recentReceipts: CollectorReceipt[]
}
