import { toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getTenantSettings } from '../services/tenantSettingsService'

export function useTenantSettings(tenantId?: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: ['tenant-settings', tenantId],
    queryFn: () => getTenantSettings(toValue(tenantId)),
  })
}
