import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { listContributions, recordCashContribution, type RecordCashContributionInput } from '../services/contributionsService'
import type { ContributionRow } from '../types/contribution'
import type { ApiError } from '@/core/api/apiError'

export function useContributions() {
  return useQuery<ContributionRow[], ApiError>({
    queryKey: ['contributions'],
    queryFn: listContributions,
  })
}

export function useRecordCashContribution() {
  const queryClient = useQueryClient()

  return useMutation<string, ApiError, RecordCashContributionInput>({
    mutationFn: (payload: RecordCashContributionInput) => recordCashContribution(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contributions'] })
      await queryClient.invalidateQueries({ queryKey: ['collector-dashboard'] })
    },
  })
}
