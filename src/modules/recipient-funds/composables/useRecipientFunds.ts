import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { recipientFundsService } from '../services/recipientFundsService'
import type { CreateRecipientFundInput, RecipientFund } from '../types/recipientFund'
import type { ApiError } from '@/core/api/apiError'

export function useRecipientFunds(eventId: MaybeRefOrGetter<string>) {
  return useQuery<RecipientFund[], ApiError>({
    queryKey: computed(() => ['recipient-funds', toValue(eventId)]),
    queryFn: () => recipientFundsService.listByEvent(toValue(eventId)),
    enabled: computed(() => Boolean(toValue(eventId))),
  })
}

export function useCreateRecipientFund(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation<RecipientFund, ApiError, CreateRecipientFundInput>({
    mutationFn: (payload: CreateRecipientFundInput) => recipientFundsService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipient-funds', eventId] })
    },
  })
}
