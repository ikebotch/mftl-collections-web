import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { eventsService } from '../services/eventsService'
import type { CreateEventInput, UpdateEventInput, Event } from '../types/event'
import type { ApiError } from '@/core/api/apiError'
import { useBranchStore } from '@/modules/branches/store/branchStore'

export function useEvents() {
  const branchStore = useBranchStore()
  
  return useQuery<Event[], ApiError>({
    queryKey: ['events', { branchId: branchStore.selectedBranchId }],
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
export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: UpdateEventInput }) => 
      eventsService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] })
    },
  })
}
