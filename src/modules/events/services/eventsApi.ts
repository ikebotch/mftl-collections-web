import httpClient, { type ApiResponse } from '../../../core/api/httpClient'
import type { Event, CreateEventRequest } from '../models/event'

export const eventsApi = {
  async getEvents(): Promise<Event[]> {
    const response = await httpClient.get<ApiResponse<Event[]>>('/v1/events')
    return response.data.data ?? []
  },

  async getEvent(id: string): Promise<Event> {
    const response = await httpClient.get<ApiResponse<Event>>(`/v1/events/${id}`)
    return response.data.data!
  },

  async createEvent(data: CreateEventRequest): Promise<Event> {
    const response = await httpClient.post<ApiResponse<Event>>('/v1/events', data)
    return response.data.data!
  }
}
