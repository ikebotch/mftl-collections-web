import { toValue, computed, type MaybeRefOrGetter } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { listUsers, getUserById, updateUser, getMe } from '../services/usersService'

import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useBranchStore } from '@/modules/branches/store/branchStore'

export function useUsers() {
  const tenantStore = useTenantStore()
  const branchStore = useBranchStore()

  return useQuery({
    queryKey: ['users', { 
      tenantId: computed(() => tenantStore.selectedTenantId),
      branchId: computed(() => branchStore.multiBranchIdCSV)
    }],
    queryFn: () => listUsers({
      tenantId: tenantStore.selectedTenantId,
      branchId: branchStore.multiBranchIdCSV
    }),
  })
}

export function useUser(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(toValue(id) as string),
    enabled: () => {
      const val = toValue(id)
      return !!val && val !== 'undefined'
    }
  })
}

export function useMe() {
  const tenantStore = useTenantStore()
  return useQuery({
    queryKey: computed(() => ['users', 'me', { tenantId: toValue(tenantStore.selectedTenantId) }]),
    queryFn: getMe,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
