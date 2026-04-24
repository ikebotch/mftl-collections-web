export interface CollectorEventRow {
  id: string
  title: string
  location: string
  shift: string
}

export interface CollectorReceipt {
  id: string
  amount: string
  status: string
  receiptNumber: string
}

export interface CollectorRow {
  id: string
  name: string
  email: string
  status: string
  activeEvents: number
  totalCollected: string
  lastActive: string
  type: string
}

export interface CollectorDto {
  id: string
  name: string
  email: string
  phoneNumber: string | null
  status: string
  assignedEventCount: number
  assignedFundCount: number
  totalCollectedToday: number
  totalCollectedMonth: number
  lastActiveAt: string | null
}

export interface CreateCollectorInput {
  name: string
  email: string
  phoneNumber?: string
  assignedEventIds?: string[]
  assignedFundIds?: string[]
}
