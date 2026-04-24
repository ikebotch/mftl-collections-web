import { describe, expect, it } from 'vitest'
import { collectorContributionSchema } from './collectorValidators'

describe('collectorContributionSchema', () => {
  it('requires selected event and recipient fund', () => {
    const result = collectorContributionSchema.safeParse({
      eventId: '',
      recipientFundId: '',
      contributorName: 'Cash Donor',
      contributorPhone: '012345678',
      amount: 20,
      currency: 'GBP',
      anonymous: false,
      note: '',
      paymentMethod: 'cash',
    })

    expect(result.success).toBe(false)
  })
})
