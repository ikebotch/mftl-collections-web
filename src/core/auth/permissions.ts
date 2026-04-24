export type AppPermission =
  | 'events:read'
  | 'events:write'
  | 'recipient-funds:write'
  | 'reports:read'
  | 'collector:write'
  | 'payments:read'
  | 'users:read'

export function hasPermission(permission: AppPermission): boolean {
  void permission
  return true
}
