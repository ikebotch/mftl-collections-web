import { describe, expect, it } from 'vitest'
import { createRecipientFundSchema } from './recipientFundValidators'

describe('createRecipientFundSchema', () => {
  it('validates recipient fund input', () => {
    const result = createRecipientFundSchema.safeParse({
      eventId: 'event-1',
      name: 'Education costs',
      description: 'Fund books and transport',
      targetAmount: 500,
    })

    expect(result.success).toBe(true)
  })
})
