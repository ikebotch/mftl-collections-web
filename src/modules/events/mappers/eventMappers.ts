import type { Event, EventDto } from '../types/event'

export function mapEventDto(dto: EventDto): Event {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    eventDate: dto.eventDate,
    status: dto.isActive ? 'active' : 'draft',
    eventType: dto.description.toLowerCase().includes('support') ? 'support' : 'community',
    currency: 'GBP',
  }
}
