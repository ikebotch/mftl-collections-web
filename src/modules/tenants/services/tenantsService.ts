import { httpClient } from '@/core/api/httpClient'

export interface TenantRow {
  id: string
  name: string
  identifier: string
}

export async function listTenants(): Promise<TenantRow[]> {
  const response = await httpClient.get<TenantRow[]>('/tenants')
  return response.data || []
}

export const tenantsService = {
  list: listTenants
}
