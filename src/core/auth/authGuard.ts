import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { auth0 } from './auth0'
import { watch } from 'vue'

export async function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const fn = async () => {
    if (auth0.isAuthenticated.value) {
      return next()
    }

    await auth0.loginWithRedirect({
      appState: { target: to.fullPath },
    })
  }

  if (!auth0.isLoading.value) {
    return fn()
  }

  watch(auth0.isLoading, (isLoading) => {
    if (!isLoading) {
      return fn()
    }
  })
}
