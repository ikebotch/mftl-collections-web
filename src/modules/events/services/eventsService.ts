import { httpClient } from '@/core/api/httpClient'
import type { Event, EventDto, CreateEventInput, UpdateEventInput } from '../types/event'
import { mapEventDto } from '../mappers/eventMappers'

export const eventsService = {
  async list(branchId?: string): Promise<Event[]> {
    const url = branchId ? `/events?branchId=${branchId}` : '/events'
    const response = await httpClient.get<EventDto[]>(url)
    const data = response.data || []
    return Array.isArray(data) ? data.map(mapEventDto) : []
  },
  async getById(id: string): Promise<Event> {
    const response = await httpClient.get<EventDto>(`/events/${id}`)
    return mapEventDto(response.data)
  },
  async create(payload: CreateEventInput): Promise<Event> {
    const response = await httpClient.post<EventDto, CreateEventInput>('/events', payload)
    return mapEventDto(response.data)
  },
  async update(id: string, payload: UpdateEventInput): Promise<Event> {
    const response = await httpClient.put<EventDto, UpdateEventInput>(`/events/${id}`, payload)
    return mapEventDto(response.data)
  },
}
