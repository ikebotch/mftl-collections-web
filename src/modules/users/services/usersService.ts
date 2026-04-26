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
}

export async function listUsers(): Promise<UserRow[]> {
  const response = await httpClient.get<any[]>('/users')
  return (response.data || []).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.scopeAssignments?.[0]?.role || 'User',
    status: u.status,
    inviteState: 'Accepted', // Placeholder until invite system implemented
    scope: u.scopeAssignments?.length > 0 ? `${u.scopeAssignments.length} Assignments` : 'None',
    phoneNumber: u.phoneNumber
  }))
}

export async function getUserById(id: string): Promise<UserRow> {
  const response = await httpClient.get<any>(`/users/${id}`)
  const u = response.data
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.scopeAssignments?.[0]?.role || 'User',
    status: u.status,
    inviteState: 'Accepted',
    scope: u.scopeAssignments?.length > 0 ? `${u.scopeAssignments.length} Assignments` : 'None',
    phoneNumber: u.phoneNumber
  }
}

export async function updateUser(id: string, payload: any): Promise<boolean> {
  const response = await httpClient.put<boolean, any>(`/users/${id}`, payload)
  return response.data
}

export const usersService = {
  list: listUsers,
  getById: getUserById,
  update: updateUser,
}
