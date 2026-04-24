import { describe, expect, it } from 'vitest'
import { collectorContributionSchema } from './collectorValidators'

describe('collectorContributionSchema', () => {
  it('requires selected event and recipient fund', () => {
    const result = collectorContributionSchema.safeParse({
      eventId: '',
      recipientFundId: '',
      contributorName: 'Cash Donor',
      contributorPhone: '012345678',
      contributorEmail: '',
      amount: 20,
      currency: 'GBP',
      anonymous: false,
      note: '',
      paymentMethod: 'cash',
    })

    expect(result.success).toBe(false)
  })

  it('allows anonymous contributions without name but still requires phone', () => {
    const result = collectorContributionSchema.safeParse({
      eventId: 'event-1',
      recipientFundId: 'fund-1',
      contributorName: '',
      contributorPhone: '012345678',
      contributorEmail: '',
      amount: 20,
      currency: 'GBP',
      anonymous: true,
      note: '',
      paymentMethod: 'cash',
    })

    expect(result.success).toBe(true)
  })
})
