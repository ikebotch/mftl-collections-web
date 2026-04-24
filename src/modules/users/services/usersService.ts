export interface UserRow {
  id: string
  name: string
  role: string
  scope: string
}

export async function listUsers(): Promise<UserRow[]> {
  return [
    { id: '1', name: 'Collections Admin', role: 'Tenant admin', scope: 'All events' },
    { id: '2', name: 'Field Collector', role: 'Collector', scope: 'Assigned events' },
  ]
}
