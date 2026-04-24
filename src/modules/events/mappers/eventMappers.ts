import type { Event, EventDto } from '../types/event'

export function mapEventDto(dto: EventDto): Event {
  const id = dto.id ?? (dto as any).Id ?? ''
  const title = dto.title ?? (dto as any).Title ?? ''
  const description = dto.description ?? (dto as any).Description ?? ''
  const slug = dto.slug ?? (dto as any).Slug ?? ''
  const eventDate = dto.eventDate ?? (dto as any).EventDate ?? null
  const isActive = dto.isActive ?? (dto as any).IsActive ?? false

  return {
    id,
    title,
    description,
    slug,
    eventDate,
    status: isActive ? 'active' : 'draft',
    eventType: description.toLowerCase().includes('support') ? 'support' : 'community',
    currency: 'GHS', // Defaulting to GHS for local context
  }
}
