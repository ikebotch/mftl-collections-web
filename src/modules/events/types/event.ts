export interface EventDto {
  id: string
  title: string
  description: string
  eventDate: string | null
  isActive: boolean
  totalRaised?: number
  totalTarget?: number
  fundCount?: number
  collectorCount?: number
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
  collectorCount: number
  slug: string
}

export interface CreateEventInput {
  title: string
  description: string
  eventDate: string | null
  slug: string
}

export interface UpdateEventInput {
  title: string
  description: string
  eventDate: string
  isActive: boolean
  slug: string
}
