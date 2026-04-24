import { useQuery } from '@tanstack/vue-query'
import { collectorService } from '../services/collectorService'
import type { CollectorProfile } from '../types/collector'
import type { ApiError } from '@/core/api/apiError'

export function useAllCollectors() {
  return useQuery<CollectorProfile[], ApiError>({
    queryKey: ['admin', 'collectors'],
    queryFn: () => collectorService.listAll(),
  })
}
