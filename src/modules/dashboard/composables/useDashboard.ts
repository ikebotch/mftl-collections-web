import { useQuery } from '@tanstack/vue-query'
import { getDashboardSummary } from '../services/dashboardService'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
  })
}
