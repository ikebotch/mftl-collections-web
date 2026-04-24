import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { eventsService } from '../services/eventsService'
import type { CreateEventInput, Event } from '../types/event'
import type { ApiError } from '@/core/api/apiError'

export function useEvents() {
  return useQuery<Event[], ApiError>({
    queryKey: ['events'],
    queryFn: () => eventsService.list(),
  })
}

export function useEvent(eventId: string) {
  return useQuery<Event, ApiError>({
    queryKey: ['events', eventId],
    queryFn: () => eventsService.getById(eventId),
    enabled: Boolean(eventId),
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEventInput) => eventsService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
