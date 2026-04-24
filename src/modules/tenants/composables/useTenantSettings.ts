import { useQuery } from '@tanstack/vue-query'
import { getTenantSettings } from '../services/tenantSettingsService'

export function useTenantSettings() {
  return useQuery({
    queryKey: ['tenant-settings'],
    queryFn: getTenantSettings,
  })
}
