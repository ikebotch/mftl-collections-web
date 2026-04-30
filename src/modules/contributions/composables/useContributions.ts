import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRef } from 'vue'
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
    queryKey: computed(() => ['contributions', { 
      tenantId: toValue(tenantStore.selectedTenantId),
      branchId: toValue(branchStore.multiBranchIdCSV),
      ...toValue(params) 
    }]),
    queryFn: () => listContributions({ 
      ...toValue(params), 
      tenantId: toValue(tenantStore.selectedTenantId),
      branchId: toValue(branchStore.multiBranchIdCSV) 
    }),
    enabled: computed(() => !!toValue(tenantStore.selectedTenantId) && toValue(tenantStore.selectedTenantId) !== '00000000-0000-0000-0000-000000000000'),
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
