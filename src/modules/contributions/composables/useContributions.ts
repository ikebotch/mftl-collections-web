import { useQuery } from '@tanstack/vue-query'
import { listContributions } from '../services/contributionsService'
import type { ContributionRow } from '../types/contribution'
import type { ApiError } from '@/core/api/apiError'

export function useContributions() {
  return useQuery<ContributionRow[], ApiError>({
    queryKey: ['contributions'],
    queryFn: listContributions,
  })
}
