import { useQuery } from '@tanstack/vue-query'
import { getDashboardSummary, type DashboardSummary } from '../services/dashboardService'
import type { ApiError } from '@/core/api/apiError'

import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useBranchStore } from '@/modules/branches/store/branchStore'
import { computed } from 'vue'

export function useDashboard() {
  const tenantStore = useTenantStore()
  const branchStore = useBranchStore()
  
  return useQuery<DashboardSummary, ApiError>({
    queryKey: ['dashboard-summary', { 
      tenantIds: computed(() => tenantStore.selectedTenantIds.join(',')),
      branchIds: computed(() => branchStore.selectedBranchIds.join(','))
    }],
    queryFn: getDashboardSummary,
  })
}
