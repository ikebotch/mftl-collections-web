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
    const roles = usersStore.roles || []
    const isAdmin = roles.some((r: string) => r.includes('Admin') || r.includes('Finance') || r.includes('Reporting') || r.includes('Manager')) || usersStore.isPlatformAdmin
    
    if (isAdmin) {
      next()
    } else if (roles.includes('Collector')) {
      next('/collector')
    } else {
      next('/pending-access')
    }
  }

  if (usersStore.me) {
    finish()
  } else {
    // Wait for me to be loaded if it's currently loading
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
    const roles = usersStore.roles || []
    const isCollector = roles.includes('Collector') || roles.includes('Collector Supervisor')
    const isAdmin = roles.some((r: string) => r.includes('Admin') || r.includes('Finance') || r.includes('Reporting') || r.includes('Manager')) || usersStore.isPlatformAdmin
    
    if (isCollector || isAdmin) {
      next()
    } else {
      next('/pending-access')
    }
  }

  if (usersStore.me) {
    finish()
  } else {
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
