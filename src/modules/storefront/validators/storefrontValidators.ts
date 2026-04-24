import { z } from 'zod'

export const amountSelectionSchema = z.object({
  recipientFundId: z.string().trim().min(1, 'Select a recipient fund'),
  amount: z.coerce.number().min(1, 'Enter an amount greater than 0'),
})

export const contributorDetailsSchema = z
  .object({
    contributorName: z.string().trim(),
    contributorPhone: z.string().trim().min(7, 'Phone number is required'),
    contributorEmail: z.string().trim().email('Enter a valid email'),
    anonymous: z.boolean(),
    note: z.string().trim().max(200).default(''),
  })
  .superRefine((value, context) => {
    if (!value.anonymous && value.contributorName.length < 2) {
      context.addIssue({
        code: 'custom',
        path: ['contributorName'],
        message: 'Contributor name is required unless the gift is anonymous',
      })
    }
  })

export const paymentMethodSchema = z.object({
  paymentMethod: z.enum(['card', 'momo', 'cash']),
})
