export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  errors: unknown[]
  correlationId: string
}

export interface ApiEnvelopeLike<T> {
  success?: boolean
  message?: string | null
  data?: T
  errors?: unknown[] | null
  correlationId?: string | null
}

export function isApiEnvelope<T>(value: unknown): value is ApiEnvelopeLike<T> {
  return Boolean(value) && typeof value === 'object' && 'success' in (value as Record<string, unknown>)
}

export function unwrapApiEnvelope<T>(value: ApiEnvelopeLike<T>): ApiEnvelope<T> {
  return {
    success: Boolean(value.success),
    message: value.message ?? '',
    data: value.data as T,
    errors: value.errors ?? [],
    correlationId: value.correlationId ?? '',
  }
}
