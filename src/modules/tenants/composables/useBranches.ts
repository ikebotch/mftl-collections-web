import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { branchesService } from '../services/branchesService'
import type { BranchDto } from '../services/branchesService'

export function useBranches(tenantId?: string) {
  return useQuery({
    queryKey: ['branches', tenantId],
    queryFn: () => branchesService.list(tenantId),
  })
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: ['branch', id],
    queryFn: () => branchesService.getById(id),
    enabled: !!id,
  })
}

export function useUpdateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => branchesService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branch', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    },
  })
}

export function useCreateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: any) => branchesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    },
  })
}
