export interface UserRow {
  id: string
  name: string
  email: string
  role: 'Platform Admin' | 'Tenant Admin' | 'Supervisor' | 'Collector'
  status: 'Active' | 'Inactive' | 'Suspended'
  inviteState: 'Accepted' | 'Pending' | 'Expired'
  scope: string
}

export async function listUsers(): Promise<UserRow[]> {
  return [
    { id: '1', name: 'Isaac Botchway', email: 'admin@mftl.com', role: 'Platform Admin', status: 'Active', inviteState: 'Accepted', scope: 'Global' },
    { id: '2', name: 'Samuel Osei', email: 'sam@field.com', role: 'Collector', status: 'Active', inviteState: 'Accepted', scope: 'Assigned Events' },
    { id: '3', name: 'Grace Mensah', email: 'grace@super.com', role: 'Supervisor', status: 'Active', inviteState: 'Pending', scope: 'Regional' },
  ]
}

export const usersService = {
  list: listUsers,
}
