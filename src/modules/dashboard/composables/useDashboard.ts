import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import { getDashboardSummary, type DashboardSummary } from '../services/dashboardService'
import type { ApiError } from '@/core/api/apiError'

import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useBranchStore } from '@/modules/branches/store/branchStore'

export function useDashboard() {
  const tenantStore = useTenantStore()
  const branchStore = useBranchStore()
  
  return useQuery<DashboardSummary, ApiError>({
    queryKey: computed(() => ['dashboard-summary', { 
      tenantId: toValue(tenantStore.selectedTenantId),
      branchId: toValue(branchStore.multiBranchIdCSV)
    }]),
    queryFn: () => getDashboardSummary({
      tenantId: toValue(tenantStore.selectedTenantId),
      branchId: toValue(branchStore.multiBranchIdCSV)
    }),
    enabled: computed(() => !!toValue(tenantStore.selectedTenantId) && toValue(tenantStore.selectedTenantId) !== '00000000-0000-0000-0000-000000000000'),
  })
}
