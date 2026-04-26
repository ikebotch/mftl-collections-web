import { httpClient } from '@/core/api/httpClient'

export interface BranchRow {
  id: string
  name: string
  identifier: string
  tenantId: string
}

export async function listBranches(tenantId?: string): Promise<BranchRow[]> {
  const url = tenantId ? `/branches?tenantId=${tenantId}` : '/branches'
  const response = await httpClient.get<BranchRow[]>(url)
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
