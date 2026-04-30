import { useQuery } from '@tanstack/vue-query'
import { donorsService } from '../services/donorsService'
import type { Donor } from '../types/donor'
import type { ApiError } from '@/core/api/apiError'

import { useTenantStore } from '@/modules/tenants/store/tenantStore'

export function useDonors() {
  const tenantStore = useTenantStore()
  return useQuery<Donor[], ApiError>({
    queryKey: ['donors', { tenantId: tenantStore.selectedTenantId }],
    queryFn: () => donorsService.list({ tenantId: tenantStore.selectedTenantId }),
  })
}

export function useDonor(id: string) {
  return useQuery<Donor, ApiError>({
    queryKey: ['donors', id],
    queryFn: () => donorsService.getById(id),
    enabled: Boolean(id),
  })
}
