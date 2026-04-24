import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { recipientFundsService } from '../services/recipientFundsService'
import type { CreateRecipientFundInput } from '../types/recipientFund'

export function useRecipientFunds(eventId: string) {
  return useQuery({
    queryKey: ['recipient-funds', eventId],
    queryFn: () => recipientFundsService.listByEvent(eventId),
    enabled: Boolean(eventId),
  })
}

export function useCreateRecipientFund(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRecipientFundInput) => recipientFundsService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipient-funds', eventId] })
    },
  })
}
