import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

export function useCurrentUser() {
  const auth0 = useAuth0()

  const currentUser = computed(() => ({
    id: String(auth0.user.value?.sub ?? ''),
    email: String(auth0.user.value?.email ?? ''),
    name: String(auth0.user.value?.name ?? ''),
  }))

  return {
    currentUser,
    isAuthenticated: auth0.isAuthenticated,
  }
}
