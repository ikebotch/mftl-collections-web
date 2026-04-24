import { useQuery } from '@tanstack/vue-query'
import { listSelfDonations, type SelfDonationRow } from '../services/selfDonationService'
import type { ApiError } from '@/core/api/apiError'

export function useSelfDonations() {
  return useQuery<SelfDonationRow[], ApiError>({
    queryKey: ['self-donations'],
    queryFn: listSelfDonations,
  })
}
