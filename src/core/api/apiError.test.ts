import { describe, expect, it } from 'vitest'
import { ApiError } from './apiError'
import { mapApiError } from './httpClient'

describe('mapApiError', () => {
  it('maps response envelope errors into ApiError', () => {
    const mapped = mapApiError({
      isAxiosError: true,
      message: 'Request failed with status code 400',
      response: {
        status: 400,
        data: {
          success: false,
          message: 'Bad request',
          errors: ['Validation failed'],
          correlationId: 'corr-400',
        },
        headers: {},
      },
    })

    expect(mapped).toBeInstanceOf(ApiError)
    expect(mapped.message).toBe('Bad request')
    expect(mapped.statusCode).toBe(400)
    expect(mapped.correlationId).toBe('corr-400')
  })
})
