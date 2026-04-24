import { describe, expect, it } from 'vitest'
import { unwrapApiEnvelope } from './apiEnvelope'

describe('unwrapApiEnvelope', () => {
  it('normalizes the backend envelope', () => {
    const envelope = unwrapApiEnvelope({
      success: true,
      message: 'ok',
      data: { id: '1' },
      errors: null,
      correlationId: 'corr-1',
    })

    expect(envelope.success).toBe(true)
    expect(envelope.data.id).toBe('1')
    expect(envelope.errors).toEqual([])
    expect(envelope.correlationId).toBe('corr-1')
  })
})
