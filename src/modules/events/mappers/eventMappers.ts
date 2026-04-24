import type { Event, EventDto } from '../types/event'

export function mapEventDto(dto: EventDto): Event {
  const id = dto.id ?? ''
  const title = dto.title ?? ''
  const description = dto.description ?? ''
  const eventDate = dto.eventDate ?? null
  const isActive = dto.isActive ?? false
  
  const totals = dto.totals ?? []
  const totalTarget = dto.totalTarget ?? 0

  return {
    id,
    title,
    description,
    eventDate,
    isActive,
    status: isActive ? 'active' : 'draft',
    totals,
    totalTarget,
    fundCount: dto.fundCount ?? 0,
    collectorCount: dto.collectorCount ?? 0,
    slug: dto.slug ?? id.slice(0, 8),
  }
}
