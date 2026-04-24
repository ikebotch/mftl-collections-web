import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { collectorService } from '../services/collectorService'
import type { CollectorAssignmentDto, CollectorMeDto, CollectorReceipt, CollectorRow, CreateCollectorInput } from '../types/collector'
import type { ApiError } from '@/core/api/apiError'

export function useCollectorMe() {
  return useQuery<CollectorMeDto, ApiError>({
    queryKey: ['collector-me'],
    queryFn: collectorService.getMe,
  })
}

export function useAssignedEvents() {
  return useQuery<CollectorAssignmentDto[], ApiError>({
    queryKey: ['collector-assignments'],
    queryFn: collectorService.listAssignments,
  })
}

export function useCollectorHistory() {
  return useQuery<CollectorReceipt[], ApiError>({
    queryKey: ['collector-history'],
    queryFn: collectorService.listCollectorHistory,
  })
}

export function useCollectors() {
  return useQuery<CollectorRow[], ApiError>({
    queryKey: ['collectors'],
    queryFn: collectorService.list,
  })
}

export function useCreateCollector() {
  const queryClient = useQueryClient()
  return useMutation<CollectorRow, ApiError, CreateCollectorInput>({
    mutationFn: collectorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectors'] })
    },
  })
}
