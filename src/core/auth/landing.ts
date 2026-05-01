import { useUsersStore } from '@/modules/users/store/usersStore'
import { Permissions } from './permissions'
import { AppRoles } from './roles'

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
    [
      AppRoles.PlatformAdmin, 
      AppRoles.OrganisationAdmin, 
      AppRoles.BranchAdmin, 
      AppRoles.FinanceAdmin, 
      AppRoles.EventManager
    ].includes(r)
  )
  
  const canViewDashboard = usersStore.hasPermission(Permissions.Dashboard.View)
  
  // If they have explicit dashboard view and are NOT just a collector, send to admin
  if (hasAdminRole || (canViewDashboard && !roles.includes(AppRoles.Collector))) {
    return '/admin'
  }
  
  // 5. Collector-only users
  const isCollector = roles.some(r => r === AppRoles.Collector)
  const hasAssignments = (usersStore.me.scopeAssignments?.length ?? 0) > 0
  
  if (isCollector || (usersStore.accessState === 'active' && hasAssignments)) {
    return '/collector'
  }
  
  // 6. Default to pending access
  return '/pending-access'
}
