import { httpClient } from '@/core/api/httpClient'

export interface UserRow {
  id: string
  name: string
  email: string
  role: string
  status: string
  inviteState: string
  scope: string
  phoneNumber?: string
  lastLoginAt?: string
  isPlatformAdmin: boolean
}

export interface UserDetail extends UserRow {
  auth0Id: string
  createdAt: string
  inviteStatus: string
  scopeAssignments: ScopeAssignment[]
  auth0Roles: string[]
}

export interface ScopeAssignment {
  id: string
  role: string
  scopeType: string
  targetId?: string
}

export interface AuditLog {
  id: string
  action: string
  details: string
  performedBy: string
  createdAt: string
}

export async function listUsers(params?: { tenantId?: string; branchId?: string }): Promise<UserRow[]> {
  const response = await httpClient.get<UserRow[]>('/users', { params })
  return response.data || []
}

export async function getUserById(id: string): Promise<UserDetail> {
  const response = await httpClient.get<UserDetail>(`/users/${id}`)
  return response.data
}

export async function getMe(): Promise<UserDetail> {
  const response = await httpClient.get<UserDetail>('/users/me')
  return response.data
}

export async function updateUser(id: string, payload: any): Promise<boolean> {
  const response = await httpClient.put<boolean, any>(`/users/${id}`, payload)
  return response.data
}

export async function inviteUser(payload: any): Promise<string> {
  const response = await httpClient.post<string, any>('/users/invite', payload)
  return response.data
}

export async function updateUserStatus(id: string, action: string): Promise<boolean> {
  const response = await httpClient.post<boolean, any>(`/users/${id}/status`, { action })
  return response.data
}

export async function getUserAuditLogs(id: string): Promise<AuditLog[]> {
  const response = await httpClient.get<AuditLog[]>(`/users/${id}/audit`)
  return response.data || []
}

export async function assignScope(userId: string, payload: { roles: string[], scopeType: string, targetId?: string }): Promise<string> {
  const response = await httpClient.post<string, any>(`/users/${userId}/scopes`, payload)
  return response.data
}

export async function revokeScope(assignmentId: string): Promise<boolean> {
  const response = await httpClient.delete<boolean>(`/users/scopes/${assignmentId}`)
  return response.data
}

export const usersService = {
  list: listUsers,
  getById: getUserById,
  getMe,
  update: updateUser,
  invite: inviteUser,
  updateStatus: updateUserStatus,
  getAuditLogs: getUserAuditLogs,
  assignScope,
  revokeScope
}
