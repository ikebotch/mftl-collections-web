import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { tenantsService } from '../services/tenantsService'

import { useTenantStore } from '../store/tenantStore'

export function useTenants() {
  const tenantStore = useTenantStore()
  return useQuery({
    queryKey: () => ['tenants', { tenantId: tenantStore.selectedTenantIdsCSV }],
    queryFn: () => tenantsService.list({ tenantId: tenantStore.selectedTenantIdsCSV }),
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { name: string, identifier: string }) => tenantsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    }
  })
}
