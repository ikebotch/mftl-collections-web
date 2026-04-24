import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { collectorService } from '../services/collectorService'
import type {
  CollectorAssignments,
  CollectorAssignedEvent,
  CollectorDashboardSummary,
  CollectorHistoryReceipt,
  CollectorProfile,
} from '../types/collector'
import type { ApiError } from '@/core/api/apiError'

export function useCollectorDashboard() {
  return useQuery<CollectorDashboardSummary, ApiError>({
    queryKey: ['collector-dashboard'],
    queryFn: collectorService.getCollectorDashboard,
  })
}

export function useCollectorProfile() {
  return useQuery<CollectorProfile, ApiError>({
    queryKey: ['collector-profile'],
    queryFn: collectorService.getCollectorProfile,
  })
}

export function useCollectorAssignments() {
  return useQuery<CollectorAssignments, ApiError>({
    queryKey: ['collector-assignments'],
    queryFn: collectorService.getCollectorAssignments,
  })
}

export function useAssignedEvents() {
  const query = useCollectorAssignments()

  return {
    ...query,
    data: computed<CollectorAssignedEvent[]>(() => query.data.value?.events ?? []),
  }
}

export function useCollectorHistory() {
  return useQuery<CollectorHistoryReceipt[], ApiError>({
    queryKey: ['collector-history'],
    queryFn: collectorService.getCollectorHistory,
  })
}
