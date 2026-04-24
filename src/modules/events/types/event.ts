export interface EventDto {
  id: string
  title: string
  description: string
  eventDate: string | null
  isActive: boolean
  totalRaised?: number
  totalTarget?: number
  fundCount?: number
  slug?: string
}

export interface Event {
  id: string
  title: string
  description: string
  eventDate: string | null
  status: 'active' | 'draft'
  eventType: 'community' | 'support'
  currency: string
  totalRaised: number
  totalTarget: number
  progress: number
  fundCount: number
  slug: string
}

export interface CreateEventInput {
  title: string
  description: string
  eventDate: string | null
  slug: string
  recipientFunds: {
    name: string
    description: string
    targetAmount: number
  }[]
}
