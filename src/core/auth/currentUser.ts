import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

export function useCurrentUser() {
  const auth0 = useAuth0()

  const currentUser = computed(() => ({
    id: String(auth0.user.value?.sub ?? ''),
    email: String(auth0.user.value?.email ?? ''),
    name: String(auth0.user.value?.name ?? ''),
    picture: String(auth0.user.value?.picture ?? ''),
    role: String((auth0.user.value as any)?.['https://mftl.com/roles']?.[0] ?? 'Admin'),
  }))

  return {
    currentUser,
    isAuthenticated: auth0.isAuthenticated,
  }
}
