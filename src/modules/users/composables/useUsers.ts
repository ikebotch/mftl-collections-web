import { toValue, computed, type MaybeRefOrGetter } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { listUsers, getUserById, updateUser, getMe } from '../services/usersService'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
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
  return useQuery({
    queryKey: ['users', 'me'],
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
