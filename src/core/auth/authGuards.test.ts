import { describe, expect, it, vi } from 'vitest'
import { requirePermission } from './authGuards'

describe('requirePermission', () => {
  it('allows navigation when the placeholder permission check passes', () => {
    const next = vi.fn()
    requirePermission('events:read')({} as never, {} as never, next)
    expect(next).toHaveBeenCalledWith()
  })
})
