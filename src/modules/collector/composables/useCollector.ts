import { useQuery } from '@tanstack/vue-query'
import { getCollectorDashboard, listAssignedEvents, listCollectorHistory } from '../services/collectorService'

export function useCollectorDashboard() {
  return useQuery({
    queryKey: ['collector-dashboard'],
    queryFn: getCollectorDashboard,
  })
}

export function useAssignedEvents() {
  return useQuery({
    queryKey: ['collector-events'],
    queryFn: listAssignedEvents,
  })
}

export function useCollectorHistory() {
  return useQuery({
    queryKey: ['collector-history'],
    queryFn: listCollectorHistory,
  })
}
