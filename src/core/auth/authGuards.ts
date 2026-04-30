import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { hasPermission, type AppPermission } from './permissions'
import { isAuthConfigured, shouldBypassAuth } from './auth0'
import { useUsersStore } from '@/modules/users/store/usersStore'
import { resolveLandingPath } from './landing'

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

    const landingPath = resolveLandingPath()
    next(landingPath)
  }
}



export function requireAdmin(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const usersStore = useUsersStore()
  
  const finish = () => {
    const landingPath = resolveLandingPath()
    
    // If they belong here, let them in
    if (landingPath === '/admin') {
      next()
      return
    }

    // If they belong in collector, and are trying to access admin, redirect them
    if (landingPath === '/collector') {
      next('/collector')
      return
    }

    // Otherwise send to their designated landing
    next(landingPath)
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
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const usersStore = useUsersStore()
  
  const finish = () => {
    const landingPath = resolveLandingPath()
    
    // If they belong in collector OR admin, let them in (admins can see collector view)
    if (landingPath === '/collector' || landingPath === '/admin') {
      next()
      return
    }

    // Otherwise send to their designated landing
    next(landingPath)
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
