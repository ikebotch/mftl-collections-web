import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { listContributions, getContributionById, updateContribution } from '../services/contributionsService'
import type { ContributionRow } from '../types/contribution'
import type { ApiError } from '@/core/api/apiError'
import { useBranchStore } from '@/modules/branches/store/branchStore'

export function useContributions() {
  const branchStore = useBranchStore()
  return useQuery<ContributionRow[], ApiError>({
    queryKey: ['contributions', { branchId: branchStore.selectedBranchId }],
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

export function useUpdateContribution() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      updateContribution(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] })
    }
  })
}
