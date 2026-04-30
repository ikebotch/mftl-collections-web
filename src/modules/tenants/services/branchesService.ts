import { httpClient } from '@/core/api/httpClient'

export interface BranchRow {
  id: string
  name: string
  identifier: string
  tenantId: string
  location?: string
  isActive?: boolean
}

export async function listBranches(tenantIds?: string | string[]): Promise<BranchRow[]> {
  const url = new URL('/branches', 'http://localhost') // dummy base for URLSearchParams
  if (tenantIds) {
    const ids = Array.isArray(tenantIds) ? tenantIds.join(',') : tenantIds
    url.searchParams.set('tenantId', ids)
  }
  const response = await httpClient.get<BranchRow[]>(url.pathname + url.search)
  return response.data || []
}

export async function getBranchById(id: string): Promise<BranchRow> {
  const response = await httpClient.get<BranchRow>(`/branches/${id}`)
  return response.data
}

export async function createBranch(payload: any): Promise<string> {
  const response = await httpClient.post<string, any>('/branches', payload)
  return response.data
}

export async function updateBranch(id: string, payload: any): Promise<boolean> {
  const response = await httpClient.put<boolean, any>(`/branches/${id}`, payload)
  return response.data
}

export async function deleteBranch(id: string): Promise<boolean> {
  const response = await httpClient.delete<boolean>(`/branches/${id}`)
  return response.data
}

export const branchesService = {
  list: listBranches,
  getById: getBranchById,
  create: createBranch,
  update: updateBranch,
  delete: deleteBranch
}
