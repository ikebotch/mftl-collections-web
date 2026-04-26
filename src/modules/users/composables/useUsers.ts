import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { listUsers, getUserById, updateUser } from '../services/usersService'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id)
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
