import { useQuery } from '@tanstack/vue-query'
import { listContributions, getContributionById } from '../services/contributionsService'
import type { ContributionRow } from '../types/contribution'
import type { ApiError } from '@/core/api/apiError'

export function useContributions() {
  return useQuery<ContributionRow[], ApiError>({
    queryKey: ['contributions'],
    queryFn: listContributions,
  })
}

export function useContribution(id: string) {
  return useQuery<ContributionRow, ApiError>({
    queryKey: ['contributions', id],
    queryFn: () => getContributionById(id),
    enabled: Boolean(id),
  })
}
