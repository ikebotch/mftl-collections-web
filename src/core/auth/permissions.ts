import { useUsersStore } from '@/modules/users/store/usersStore'

/**
 * Permission constants — mirror of backend Permissions.cs.
 */
export type AppPermission = string

export const Permissions = {
  Dashboard: {
    View: 'dashboard.view',
    /** @deprecated prefer Dashboard.View */
    Admin: 'dashboard.admin',
  },

  Organisations: {
    View: 'organisations.view',
    Create: 'organisations.create',    // Platform Admin only
    Update: 'organisations.update',
    Delete: 'organisations.delete',    // Platform Admin only
  },

  Branches: {
    View: 'branches.view',
    Create: 'branches.create',
    Update: 'branches.update',
    Delete: 'branches.delete',
  },

  Users: {
    View: 'users.view',
    Invite: 'users.invite',
    Update: 'users.update',
    Suspend: 'users.suspend',
    RolesAssign: 'users.roles.assign',
    ScopesAssign: 'users.scopes.assign',
    ScopesRevoke: 'users.scopes.revoke',
    /** @deprecated prefer ScopesAssign */
    AssignScope: 'users.assign-scope',
  },

  Events: {
    View: 'events.view',
    Create: 'events.create',
    Update: 'events.update',
    Delete: 'events.delete',
    AssignStaff: 'events.assign-staff',
  },

  RecipientFunds: {
    View: 'recipient-funds.view',
    Create: 'recipient-funds.create',
    Update: 'recipient-funds.update',
    Delete: 'recipient-funds.delete',
  },

  Contributions: {
    View: 'contributions.view',
    Create: 'contributions.create',
    Update: 'contributions.update',
    Reverse: 'contributions.reverse',
    /** @deprecated prefer Contributions.View/Create/Update */
    Settle: 'contributions.settle',
  },

  Receipts: {
    View: 'receipts.view',
    Resend: 'receipts.resend',
  },

  Payments: {
    View: 'payments.view',
    Initiate: 'payments.initiate',
    Refund: 'payments.refund',
    RefundApprove: 'payments.refund.approve',
    Reconcile: 'payments.reconcile',
    RefundsView: 'payments.refunds.view',
    /** @deprecated prefer Payments.View */
    Retry: 'payments.retry',
  },

  Settlements: {
    View: 'settlements.view',
    Submit: 'settlements.submit',
    Approve: 'settlements.approve',
    Reject: 'settlements.reject',
    Reconcile: 'settlements.reconcile',
  },

  Reports: {
    View: 'reports.view',
    Export: 'reports.export',
  },

  Donors: {
    View: 'donors.view',
    Update: 'donors.update',
    /** @deprecated prefer Donors.View */
    Create: 'donors.create',
  },

  NotificationTemplates: {
    View: 'notification-templates.view',
    Create: 'notification-templates.create',
    Update: 'notification-templates.update',
    Delete: 'notification-templates.delete',
    Test: 'notification-templates.test',
    SystemManage: 'notification-templates.system.manage',   // Platform Admin only
  },

  Notifications: {
    View: 'notifications.view',
    Retry: 'notifications.retry',
  },

  Settings: {
    View: 'settings.view',
    Update: 'settings.update',
  },

  Platform: {
    Manage: 'platform.manage',   // Platform Admin only
  },

  /** @deprecated use Notifications.* or NotificationTemplates.* */
  Donations: {
    View: 'donations.view',
  },
} as const

export type PermissionKey = typeof Permissions[keyof typeof Permissions] extends Record<string, infer V> ? V : never

/**
 * Global helper to check permissions.
 * Delegated to usersStore.hasPermission().
 */
export function hasPermission(permission: string): boolean {
  try {
    const store = useUsersStore()
    return store.hasPermission(permission)
  } catch (e) {
    // Fallback if pinia is not active yet
    return false
  }
}
