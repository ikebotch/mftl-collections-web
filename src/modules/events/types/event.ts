export interface EventDto {
  id: string
  title: string
  description: string
  eventDate: string | null
  isActive: boolean
}

export interface Event {
  id: string
  title: string
  description: string
  eventDate: string | null
  status: 'active' | 'draft'
  eventType: 'community' | 'support'
  currency: string
}

export interface CreateEventInput {
  title: string
  description: string
  eventDate: string | null
}
