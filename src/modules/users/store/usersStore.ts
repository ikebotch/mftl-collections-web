import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserDetail } from '../services/usersService'

export const useUsersStore = defineStore('users-module', () => {
  const me = ref<UserDetail | null>(null)
  
  const isAuthenticated = computed(() => !!me.value)
  const isPlatformAdmin = computed(() => me.value?.isPlatformAdmin ?? false)
  const accessState = computed(() => me.value?.accessState ?? 'pending-access')
  
  const roles = computed(() => me.value?.auth0Roles ?? [])
  const scopes = computed(() => me.value?.scopeAssignments ?? [])

  function setMe(profile: UserDetail | null) {
    me.value = profile
  }

  function clear() {
    me.value = null
  }

  return {
    me,
    isAuthenticated,
    isPlatformAdmin,
    accessState,
    roles,
    scopes,
    setMe,
    clear
  }
})
