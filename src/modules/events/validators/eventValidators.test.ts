import { describe, expect, it } from 'vitest'
import { createEventSchema } from './eventValidators'

describe('createEventSchema', () => {
  it('validates admin event creation input', () => {
    const result = createEventSchema.safeParse({
      title: 'Support event',
      description: 'Detailed description',
      eventDate: '2026-04-25',
    })

    expect(result.success).toBe(true)
  })
})
