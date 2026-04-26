import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { recipientFundsService } from '../services/recipientFundsService'
import type { CreateRecipientFundInput, RecipientFund } from '../types/recipientFund'
import type { ApiError } from '@/core/api/apiError'

export function useAllRecipientFunds() {
  return useQuery<RecipientFund[], ApiError>({
    queryKey: ['recipient-funds'],
    queryFn: () => recipientFundsService.list(),
  })
}

export function useRecipientFund(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery<RecipientFund, ApiError>({
    queryKey: ['recipient-funds', id],
    queryFn: () => recipientFundsService.getById(toValue(id) as string),
    enabled: () => {
      const val = toValue(id)
      return !!val && val !== 'undefined'
    },
  })
}

export function useCreateRecipientFund(eventId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRecipientFundInput) => recipientFundsService.create(payload),
    onSuccess: async () => {
      if (eventId) {
        await queryClient.invalidateQueries({ queryKey: ['recipient-funds', eventId] })
      }
      await queryClient.invalidateQueries({ queryKey: ['recipient-funds'] })
    },
  })
}

export function useUpdateRecipientFund() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: CreateRecipientFundInput }) => 
      recipientFundsService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipient-funds'] })
      queryClient.invalidateQueries({ queryKey: ['recipient-funds', variables.id] })
    },
  })
}
