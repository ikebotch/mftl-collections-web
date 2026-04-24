import { useQuery } from '@tanstack/vue-query'
import { getReportSummary } from '../services/reportsService'

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: getReportSummary,
  })
}
