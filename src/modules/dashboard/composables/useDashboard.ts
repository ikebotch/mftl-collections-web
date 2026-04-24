import { useQuery } from '@tanstack/vue-query'
import { getDashboardSummary, type DashboardSummary } from '../services/dashboardService'
import type { ApiError } from '@/core/api/apiError'

export function useDashboard() {
  return useQuery<DashboardSummary, ApiError>({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
  })
}
