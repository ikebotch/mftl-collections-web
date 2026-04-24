import { httpClient } from '@/core/api/httpClient'
import type { Event, EventDto, CreateEventInput } from '../types/event'
import { mapEventDto } from '../mappers/eventMappers'

export const eventsService = {
  async list(): Promise<Event[]> {
    const response = await httpClient.get<EventDto[]>('/events')
    return response.data.map(mapEventDto)
  },
  async getById(id: string): Promise<Event> {
    const response = await httpClient.get<EventDto>(`/events/${id}`)
    return mapEventDto(response.data)
  },
  async create(payload: CreateEventInput): Promise<Event> {
    const response = await httpClient.post<EventDto, CreateEventInput>('/events', payload)
    return mapEventDto(response.data)
  },
}
