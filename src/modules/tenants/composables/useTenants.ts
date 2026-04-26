import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { tenantsService } from '../services/tenantsService'

export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => tenantsService.list(),
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { name: string, identifier: string }) => tenantsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    }
  })
}
