import { useQuery } from '@tanstack/vue-query'
import { getCollectorDashboard, listAssignedEvents, listCollectorHistory } from '../services/collectorService'
import type { CollectorDashboardSummary, CollectorEventRow, CollectorReceipt } from '../types/collector'
import type { ApiError } from '@/core/api/apiError'

export function useCollectorDashboard() {
  return useQuery<CollectorDashboardSummary, ApiError>({
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
