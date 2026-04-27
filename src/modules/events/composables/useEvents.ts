import { toValue, computed, type MaybeRefOrGetter } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { eventsService } from '../services/eventsService'
import type { CreateEventInput, UpdateEventInput, Event } from '../types/event'
import type { ApiError } from '@/core/api/apiError'
import { useBranchStore } from '@/modules/branches/store/branchStore'

import { useTenantStore } from '@/modules/tenants/store/tenantStore'

export function useEvents(branchId?: MaybeRefOrGetter<string | undefined>) {
  const tenantStore = useTenantStore()
  const branchStore = useBranchStore()
  const effectiveBranchId = computed(() => toValue(branchId) || branchStore.multiBranchIdCSV)

  return useQuery<Event[], ApiError>({
    queryKey: () => ['events', { 
      tenantId: tenantStore.selectedTenantIdsCSV,
      branchId: effectiveBranchId.value 
    }],
    queryFn: () => eventsService.list({
      tenantId: tenantStore.selectedTenantIdsCSV,
      branchId: effectiveBranchId.value
    }),
  })
}

export function useEvent(eventId: MaybeRefOrGetter<string | undefined>) {
  return useQuery<Event, ApiError>({
    queryKey: ['events', eventId],
    queryFn: () => eventsService.getById(toValue(eventId) as string),
    enabled: () => {
      const val = toValue(eventId)
      return !!val && val !== 'undefined'
    },
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
