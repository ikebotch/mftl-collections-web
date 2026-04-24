import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { listAssignedEvents, listCollectorHistory, collectorService, getCollectorDashboard } from '../services/collectorService'
import type { CollectorEventRow, CollectorReceipt, CollectorRow, CreateCollectorInput } from '../types/collector'
import type { ApiError } from '@/core/api/apiError'

export function useCollectorDashboard() {
  return useQuery<{
    todayCollections: string
    receiptsIssued: string
    assignedEvents: string
  }, ApiError>({
    queryKey: ['collector-dashboard'],
    queryFn: getCollectorDashboard,
  })
}

export function useAssignedEvents() {
  return useQuery<CollectorEventRow[], ApiError>({
    queryKey: ['collector-events'],
    queryFn: listAssignedEvents,
  })
}

export function useCollectorHistory() {
  return useQuery<CollectorReceipt[], ApiError>({
    queryKey: ['collector-history'],
    queryFn: listCollectorHistory,
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
