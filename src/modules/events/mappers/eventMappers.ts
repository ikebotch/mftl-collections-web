import type { Event, EventDto } from '../types/event'

export function mapEventDto(dto: EventDto): Event {
  const id = dto.id ?? (dto as EventDto & { Id?: string }).Id ?? ''
  const title = dto.title ?? (dto as EventDto & { Title?: string }).Title ?? ''
  const description =
    dto.description ?? (dto as EventDto & { Description?: string }).Description ?? ''
  const eventDate =
    dto.eventDate ?? (dto as EventDto & { EventDate?: string | null }).EventDate ?? null
  const isActive = dto.isActive ?? (dto as EventDto & { IsActive?: boolean }).IsActive ?? false

  return {
    id,
    title,
    description,
    eventDate,
    status: isActive ? 'active' : 'draft',
    eventType: description.toLowerCase().includes('support') ? 'support' : 'community',
    currency: 'GBP',
  }
}
