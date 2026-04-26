import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { createDevAuthUser, shouldBypassAuth } from './auth0'

export function useCurrentUser() {
  if (shouldBypassAuth()) {
    const devUser = createDevAuthUser()

    return {
      currentUser: computed(() => ({
        id: devUser.sub,
        email: devUser.email,
        name: devUser.name,
        picture: devUser.picture,
        role: devUser.role,
      })),
      isAuthenticated: computed(() => true),
    }
  }

  const auth0 = useAuth0()
  const roleClaim = 'https://mftl.com/roles'

  const currentUser = computed(() => ({
    id: String(auth0.user.value?.sub ?? ''),
    email: String(auth0.user.value?.email ?? ''),
    name: String(auth0.user.value?.name ?? ''),
    picture: String(auth0.user.value?.picture ?? ''),
    role: String(
      (
        auth0.user.value &&
        typeof auth0.user.value === 'object' &&
        roleClaim in auth0.user.value &&
        Array.isArray(auth0.user.value[roleClaim as keyof typeof auth0.user.value])
          ? auth0.user.value[roleClaim as keyof typeof auth0.user.value]?.[0]
          : undefined
      ) ?? 'User',
    ),
  }))

  return {
    currentUser,
    isAuthenticated: auth0.isAuthenticated,
  }
}
