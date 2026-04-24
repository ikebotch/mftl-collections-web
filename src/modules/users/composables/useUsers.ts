import { useQuery } from '@tanstack/vue-query'
import { listUsers } from '../services/usersService'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
  })
}
