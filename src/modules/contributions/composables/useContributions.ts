import { useQuery } from '@tanstack/vue-query'
import { listContributions } from '../services/contributionsService'

export function useContributions() {
  return useQuery({
    queryKey: ['contributions'],
    queryFn: listContributions,
  })
}
