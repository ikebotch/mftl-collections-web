import { toValue, computed, type MaybeRefOrGetter } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { branchesService } from '../services/branchesService'
import type { BranchDto } from '../services/branchesService'

export function useBranches(tenantIds?: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: ['branches', { tenantId: computed(() => toValue(tenantIds)) }],
    queryFn: () => branchesService.list(toValue(tenantIds)),
  })
}

export function useBranch(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: ['branch', id],
    queryFn: () => branchesService.getById(toValue(id) as string),
    enabled: () => {
      const val = toValue(id)
      return !!val && val !== 'undefined'
    },
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
