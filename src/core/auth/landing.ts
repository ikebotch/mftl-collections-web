import { useUsersStore } from '@/modules/users/store/usersStore'
import { Permissions } from './permissions'

/**
 * Resolves the appropriate landing path for a user based on their effective permissions
 * in the current active tenant context.
 */
export function resolveLandingPath(): string {
  const usersStore = useUsersStore()
  
  // 1. If not authenticated or me not fetched yet, fallback to pending
  if (!usersStore.me) return '/pending-access'
  
  // 2. Handle suspended state
  if (usersStore.accessState === 'suspended') return '/access-suspended'
  
  // 3. Platform Admin always lands on Admin Dashboard
  if (usersStore.isPlatformAdmin) return '/admin'
  
  const roles = usersStore.roles || []
  
  // 4. Admin-like roles or explicit admin dashboard permission
  const hasAdminRole = roles.some(r => 
    ['Tenant Admin', 'Organisation Admin', 'Branch Admin', 'Organisation Finance', 'Branch Finance', 'Organisation Reporting', 'Finance Admin', 'Event Manager', 'System Manager'].includes(r) ||
    r.includes('Admin') || r.includes('Finance') || r.includes('Reporting')
  )
  
  const canViewDashboard = usersStore.hasPermission(Permissions.Dashboard.View)
  const canViewUsers = usersStore.hasPermission(Permissions.Users.View)
  
  // If they have explicit dashboard view and are NOT just a collector, send to admin
  // A collector also has dashboard.view (collector dashboard), so we check roles too
  if (hasAdminRole || (canViewDashboard && !roles.includes('Collector'))) {
    return '/admin'
  }
  
  // 5. Collector-only users
  const isCollector = roles.some(r => ['Collector', 'Collector Supervisor'].includes(r))
  const hasAssignments = (usersStore.me.scopeAssignments?.length ?? 0) > 0
  
  if (isCollector || (usersStore.accessState === 'active' && hasAssignments)) {
    return '/collector'
  }
  
  // 6. Default to pending access
  return '/pending-access'
}
