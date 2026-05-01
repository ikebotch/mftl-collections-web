export const AppRoles = {
  PlatformAdmin: 'PlatformAdmin',
  OrganisationAdmin: 'OrganisationAdmin',
  FinanceAdmin: 'FinanceAdmin',
  BranchAdmin: 'BranchAdmin',
  EventManager: 'EventManager',
  NotificationManager: 'NotificationManager',
  Collector: 'Collector',
  Viewer: 'Viewer'
} as const

export type AppRole = keyof typeof AppRoles

export const AppRoleLabels: Record<string, string> = {
  [AppRoles.PlatformAdmin]: 'Platform Admin',
  [AppRoles.OrganisationAdmin]: 'Organisation Admin',
  [AppRoles.FinanceAdmin]: 'Finance Admin',
  [AppRoles.BranchAdmin]: 'Branch Admin',
  [AppRoles.EventManager]: 'Event Manager',
  [AppRoles.NotificationManager]: 'Notification Manager',
  [AppRoles.Collector]: 'Collector',
  [AppRoles.Viewer]: 'Viewer'
}

export const getRoleLabel = (role: string) => AppRoleLabels[role] || role
