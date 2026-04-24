export interface ApiErrorDetails {
  message: string
  statusCode?: number
  errors?: unknown[]
  correlationId?: string
}

export class ApiError extends Error {
  readonly statusCode?: number
  readonly errors: unknown[]
  readonly correlationId?: string

  constructor({ message, statusCode, errors, correlationId }: ApiErrorDetails) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors ?? []
    this.correlationId = correlationId
  }
}
