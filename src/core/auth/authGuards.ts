import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { hasPermission, type AppPermission } from './permissions'
import { isAuthConfigured, shouldBypassAuth } from './auth0'

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
