import { useQuery } from '@tanstack/vue-query'
import { donorsService } from '../services/donorsService'
import type { Donor } from '../types/donor'
import type { ApiError } from '@/core/api/apiError'

export function useDonors() {
  return useQuery<Donor[], ApiError>({
    queryKey: ['donors'],
    queryFn: () => donorsService.list(),
  })
}

export function useDonor(id: string) {
  return useQuery<Donor, ApiError>({
    queryKey: ['donors', id],
    queryFn: () => donorsService.getById(id),
    enabled: Boolean(id),
  })
}
