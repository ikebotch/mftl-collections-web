import { describe, it, expect } from 'vitest'
import { CreateEventSchema } from './event'

describe('CreateEventSchema Validation', () => {
  it('passes with valid data', () => {
    const result = CreateEventSchema.safeParse({
      title: 'Valid Title',
      description: 'Optional desc',
      eventDate: '2026-05-01T00:00:00Z'
    })
    expect(result.success).toBe(true)
  })

  it('fails when title is empty', () => {
    const result = CreateEventSchema.safeParse({
      title: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required')
    }
  })
})
