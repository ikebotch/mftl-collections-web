export interface CurrencyTotal {
  currency: string
  amount: number
}

export interface EventDto {
  id: string
  title: string
  description: string
  eventDate: string | null
  isActive: boolean
  totals?: CurrencyTotal[]
  totalTarget: number
  fundCount: number
  collectorCount: number
  slug: string
  displayImageUrl?: string
  receiptLogoUrl?: string
  metadata?: string
}

export interface Event extends EventDto {
  status: 'active' | 'draft'
}

export interface CreateEventInput {
  title: string
  description: string
  eventDate: string | null
  slug: string
  branchId: string
  displayImageUrl?: string
  receiptLogoUrl?: string
  metadata?: string
}

export interface UpdateEventInput {
  title: string
  description: string
  eventDate: string
  isActive: boolean
  slug: string
  displayImageUrl?: string
  receiptLogoUrl?: string
  metadata?: string
}
