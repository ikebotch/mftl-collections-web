import { useQuery } from '@tanstack/vue-query'
import { listSelfDonations } from '../services/selfDonationService'

export function useSelfDonations() {
  return useQuery({
    queryKey: ['self-donations'],
    queryFn: listSelfDonations,
  })
}
