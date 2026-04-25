import { httpClient } from '@/core/api/httpClient'
import type { Event, UpdateEventInput } from '../types/event'

export async function listEvents(): Promise<Event[]> {
  const response = await httpClient.get<Event[]>('/events')
  return response.data ?? []
}

export async function getEventById(id: string): Promise<Event> {
  const response = await httpClient.get<Event>(`/events/${id}`)
  return response.data
}

export async function updateEvent(id: string, payload: UpdateEventInput): Promise<Event> {
  const response = await httpClient.put<Event, UpdateEventInput>(`/events/${id}`, payload)
  return response.data
}

export async function assignStaffToEvent(id: string, userIds: string[]): Promise<boolean> {
  const response = await httpClient.post<boolean, string[]>(`/events/${id}/staff`, userIds)
  return response.data
}

export const eventService = {
  list: listEvents,
  getById: getEventById,
  update: updateEvent,
  assignStaff: assignStaffToEvent,
}
