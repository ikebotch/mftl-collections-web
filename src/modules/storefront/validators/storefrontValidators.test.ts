import { describe, expect, it } from 'vitest'
import { amountSelectionSchema, contributorDetailsSchema, paymentMethodSchema } from './storefrontValidators'

describe('storefront validators', () => {
  it('requires recipient selection and amount', () => {
    expect(
      amountSelectionSchema.safeParse({
        recipientFundId: '',
        amount: 0,
      }).success,
    ).toBe(false)
  })

  it('supports anonymous contribution toggle', () => {
    const result = contributorDetailsSchema.safeParse({
      contributorName: '',
      contributorPhone: '012345678',
      contributorEmail: 'anonymous@example.com',
      anonymous: true,
      note: '',
    })

    expect(result.success).toBe(true)
  })

  it('validates payment selection', () => {
    expect(paymentMethodSchema.safeParse({ paymentMethod: 'card' }).success).toBe(true)
  })
})
