export function createCorrelationId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `corr-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const CORRELATION_HEADER_NAME = 'x-correlation-id'
