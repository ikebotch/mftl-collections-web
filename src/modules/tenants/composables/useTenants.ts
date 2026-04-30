import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import { tenantsService } from '../services/tenantsService'

import { useTenantStore } from '../store/tenantStore'

export function useTenants() {
  const tenantStore = useTenantStore()
  return useQuery({
    queryKey: computed(() => ['tenants', { tenantId: toValue(tenantStore.selectedTenantIdsCSV) }]),
    queryFn: () => tenantsService.list({ tenantId: toValue(tenantStore.selectedTenantIdsCSV) }),
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
