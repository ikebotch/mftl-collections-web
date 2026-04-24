import { z } from 'zod'

export const createRecipientFundSchema = z.object({
  eventId: z.string().trim().min(1),
  name: z.string().trim().min(2, 'Recipient fund name is required'),
  description: z.string().trim().min(5, 'Description is required'),
  targetAmount: z.coerce.number().min(0, 'Target amount must be 0 or more'),
})

export type CreateRecipientFundSchema = z.infer<typeof createRecipientFundSchema>
