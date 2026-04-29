import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { hasPermission, type AppPermission } from './permissions'
import { isAuthConfigured, shouldBypassAuth } from './auth0'
import { useUsersStore } from '@/modules/users/store/usersStore'

type GuardContext = {
  app?: {
    runWithContext<T>(callback: () => T): T
  }
}

function redirectToLogin(to: RouteLocationNormalized, next: NavigationGuardNext) {
  return (auth0: ReturnType<typeof useAuth0> | undefined) => {
    const finish = async () => {
      if (shouldBypassAuth() || !auth0 || auth0.isAuthenticated.value || !isAuthConfigured()) {
        next()
        return
      }

      await auth0.loginWithRedirect({
        appState: { target: to.fullPath },
      })
    }

    if (!auth0 || !auth0.isLoading.value) {
      void finish()
      return
    }

    watch(auth0.isLoading, (loading) => {
      if (!loading) {
        void finish()
      }
    })
  }
}

export function requireAuth(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (shouldBypassAuth()) {
    next()
    return
  }

  const auth0 = useAuth0()
  return redirectToLogin(to, next)(auth0)
}

export function requirePermission(permission: AppPermission) {
  return (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    if (hasPermission(permission)) {
      next()
      return
    }

    next('/admin')
  }
}



export function requireAdmin(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const usersStore = useUsersStore()
  
  const finish = () => {
    if (usersStore.accessState === 'suspended') {
      return next('/access-suspended')
    }

    const roles = usersStore.roles || []
    const isAdmin = roles.some((r: string) => 
      ['Platform Admin', 'Organisation Admin', 'Branch Admin', 'Organisation Finance', 'Branch Finance', 'Organisation Reporting', 'System Manager'].includes(r) ||
      r.includes('Admin') || r.includes('Finance') || r.includes('Reporting')
    ) || usersStore.isPlatformAdmin
    
    if (isAdmin) {
      next()
    } else if (roles.some(r => ['Collector', 'Collector Supervisor'].includes(r))) {
      next('/collector')
    } else {
      next('/pending-access')
    }
  }

  if (usersStore.me) {
    finish()
  } else {
    // Trigger fetch and wait for it
    usersStore.fetchMe().catch(err => {
      console.error('Guard: Failed to fetch user profile:', err)
      next('/pending-access')
    })

    const unwatch = watch(() => usersStore.me, (me) => {
      if (me) {
        unwatch()
        finish()
      }
    })
  }
}

export function requireCollector(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const usersStore = useUsersStore()
  
  const finish = () => {
    if (usersStore.accessState === 'suspended') {
      return next('/access-suspended')
    }

    const roles = usersStore.roles || []
    const isCollector = roles.some(r => ['Collector', 'Collector Supervisor'].includes(r))
    const isAdmin = roles.some((r: string) => 
      ['Platform Admin', 'Organisation Admin', 'Branch Admin', 'Organisation Finance', 'Branch Finance', 'Organisation Reporting', 'System Manager'].includes(r) ||
      r.includes('Admin') || r.includes('Finance') || r.includes('Reporting')
    ) || usersStore.isPlatformAdmin
    
    if (isCollector || isAdmin) {
      next()
    } else {
      next('/pending-access')
    }
  }

  if (usersStore.me) {
    finish()
  } else {
    // Trigger fetch and wait for it
    usersStore.fetchMe().catch(err => {
      console.error('Guard: Failed to fetch user profile:', err)
      next('/pending-access')
    })

    const unwatch = watch(() => usersStore.me, (me) => {
      if (me) {
        unwatch()
        finish()
      }
    })
  }
}

export function installAuthTokenBridge(context: GuardContext) {
  if (shouldBypassAuth()) {
    return
  }

  context.app?.runWithContext(() => {
    const auth0 = useAuth0()
    if (!auth0) {
      return
    }
  })
}
