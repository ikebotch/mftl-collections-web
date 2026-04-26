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

export async function createTenant(data: { name: string, identifier: string }): Promise<string> {
  const response = await httpClient.post<string>('/tenants', data)
  return response.data
}

export async function updateTenant(id: string, data: any): Promise<boolean> {
  const response = await httpClient.put<boolean>(`/tenants/${id}`, data)
  return response.data
}

export const tenantsService = {
  list: listTenants,
  create: createTenant,
  update: updateTenant
}
