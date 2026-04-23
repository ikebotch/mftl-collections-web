import { z } from 'zod'

export const RecipientFundSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  targetAmount: z.number().min(0),
  collectedAmount: z.number().min(0),
})

export type RecipientFund = z.infer<typeof RecipientFundSchema>

export const CreateRecipientFundSchema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().default(''),
  targetAmount: z.number().min(0, 'Target amount must be a positive number'),
})

export type CreateRecipientFundRequest = z.infer<typeof CreateRecipientFundSchema>
