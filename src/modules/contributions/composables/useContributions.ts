import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRef } from 'vue'
import { listContributions, getContributionById, updateContribution } from '../services/contributionsService'
import type { ContributionRow } from '../types/contribution'
import type { ApiError } from '@/core/api/apiError'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useBranchStore } from '@/modules/branches/store/branchStore'
import type { PagedResponse } from '@/core/api/types'

export function useContributions(params?: MaybeRef<{ page?: number, pageSize?: number }>) {
  const tenantStore = useTenantStore()
  const branchStore = useBranchStore()
  return useQuery<PagedResponse<ContributionRow>, ApiError>({
    queryKey: () => ['contributions', { 
      tenantId: tenantStore.selectedTenantIdsCSV,
      branchId: branchStore.multiBranchIdCSV,
      ...toValue(params) 
    }],
    queryFn: () => listContributions({ 
      ...toValue(params), 
      tenantId: tenantStore.selectedTenantIdsCSV,
      branchId: branchStore.multiBranchIdCSV 
    }),
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
