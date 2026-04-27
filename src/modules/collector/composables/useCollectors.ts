import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { collectorService } from '../services/collectorService'
import type { CollectorProfile } from '../types/collector'
import type { ApiError } from '@/core/api/apiError'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useBranchStore } from '@/modules/branches/store/branchStore'

export function useAllCollectors() {
  const tenantStore = useTenantStore()
  const branchStore = useBranchStore()
  return useQuery<CollectorProfile[], ApiError>({
    queryKey: () => ['admin', 'collectors', { 
      tenantId: tenantStore.selectedTenantIdsCSV,
      branchId: branchStore.multiBranchIdCSV 
    }],
    queryFn: () => collectorService.listAll({
      tenantId: tenantStore.selectedTenantIdsCSV,
      branchId: branchStore.multiBranchIdCSV
    }),
  })
}

export function useCollector(id: string) {
  return useQuery<CollectorProfile, ApiError>({
    queryKey: ['admin', 'collectors', id],
    queryFn: () => collectorService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCollector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: any) => collectorService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'collectors'] })
    },
  })
}

export function useUpdateCollector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => collectorService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'collectors'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'collectors', id] })
    },
  })
}
