import { z } from 'zod'

export const collectorContributionSchema = z.object({
  eventId: z.string().trim().min(1, 'Selected event is required'),
  recipientFundId: z.string().trim().min(1, 'Selected recipient fund is required'),
  contributorName: z.string().trim().min(2, 'Contributor name is required'),
  contributorPhone: z.string().trim().min(7, 'Phone number is required'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  currency: z.string().trim().min(3),
  anonymous: z.boolean(),
  note: z.string().trim().default(''),
  paymentMethod: z.enum(['cash', 'momo', 'card']),
})
