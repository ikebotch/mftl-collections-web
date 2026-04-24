import { useQuery } from '@tanstack/vue-query'
import { listSettlements } from '../services/settlementsService'

export function useSettlements() {
  return useQuery({
    queryKey: ['settlements'],
    queryFn: listSettlements,
  })
}
