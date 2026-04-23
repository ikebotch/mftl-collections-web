import { describe, it, expect } from 'vitest'
import { CreateRecipientFundSchema } from './recipientFund'

describe('CreateRecipientFundSchema Validation', () => {
  it('passes with valid data', () => {
    const result = CreateRecipientFundSchema.safeParse({
      eventId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Valid Name',
      targetAmount: 100
    })
    expect(result.success).toBe(true)
  })

  it('fails with negative target amount', () => {
    const result = CreateRecipientFundSchema.safeParse({
      eventId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Valid Name',
      targetAmount: -10
    })
    expect(result.success).toBe(false)
  })
})
