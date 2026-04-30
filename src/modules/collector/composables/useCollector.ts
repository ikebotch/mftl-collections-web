import { computed, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { collectorService } from '../services/collectorService'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import type {
  CollectorAssignments,
  CollectorAssignedEvent,
  CollectorDashboardSummary,
  CollectorHistoryReceipt,
  CollectorProfile,
  CollectorSettlement,
} from '../types/collector'
import type { ApiError } from '@/core/api/apiError'

export function useCollectorDashboard() {
  const tenantStore = useTenantStore()
  return useQuery<CollectorDashboardSummary, ApiError>({
    queryKey: computed(() => ['collector-dashboard', { tenantId: toValue(tenantStore.selectedTenantId) }]),
    queryFn: collectorService.getCollectorDashboard,
    enabled: computed(() => !!toValue(tenantStore.selectedTenantId)),
  })
}

export function useCollectorProfile() {
  const tenantStore = useTenantStore()
  return useQuery<CollectorProfile, ApiError>({
    queryKey: computed(() => ['collector-profile', { tenantId: toValue(tenantStore.selectedTenantId) }]),
    queryFn: collectorService.getCollectorProfile,
    enabled: computed(() => !!toValue(tenantStore.selectedTenantId)),
  })
}

export function useCollectorAssignments() {
  const tenantStore = useTenantStore()
  return useQuery<CollectorAssignments, ApiError>({
    queryKey: computed(() => ['collector-assignments', { tenantId: toValue(tenantStore.selectedTenantId) }]),
    queryFn: collectorService.getCollectorAssignments,
    enabled: computed(() => !!toValue(tenantStore.selectedTenantId)),
  })
}

export function useAssignedEvents() {
  const query = useCollectorAssignments()

  return {
    ...query,
    data: computed<CollectorAssignedEvent[]>(() => query.data.value?.events ?? []),
  }
}

export function useCollectorHistory() {
  const tenantStore = useTenantStore()
  return useQuery<CollectorHistoryReceipt[], ApiError>({
    queryKey: computed(() => ['collector-history', { tenantId: toValue(tenantStore.selectedTenantId) }]),
    queryFn: collectorService.getCollectorHistory,
    enabled: computed(() => !!toValue(tenantStore.selectedTenantId)),
  })
}

export function useCollectorSettlements() {
  const tenantStore = useTenantStore()
  return useQuery<CollectorSettlement[], ApiError>({
    queryKey: computed(() => ['collector-settlements', { tenantId: toValue(tenantStore.selectedTenantId) }]),
    queryFn: collectorService.getCollectorSettlements,
    enabled: computed(() => !!toValue(tenantStore.selectedTenantId)),
  })
}
