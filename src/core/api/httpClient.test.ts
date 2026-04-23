import { describe, it, expect, vi, beforeEach } from 'vitest'
import httpClient, { ApiError } from './httpClient'
import { useTenantStore } from '../stores/tenantStore'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('../config/appConfig', () => ({
  appConfig: {
    api: {
      baseUrl: 'http://test-api',
      tenantHeaderName: 'X-Tenant-Id'
    }
  }
}))

describe('HttpClient', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should include tenant header when tenant is set', async () => {
    const tenantStore = useTenantStore()
    tenantStore.setTenant('tenant-123', 'Test Tenant')

    // Interceptors are applied to the request config
    const config = await (httpClient.interceptors.request as any).handlers[0].fulfilled({
      headers: {}
    })

    expect(config.headers['X-Tenant-Id']).toBe('tenant-123')
  })

  it('should throw ApiError on failure response', async () => {
    const errorResponse = {
      data: {
        success: false,
        message: 'Invalid request',
        errors: ['Field is required'],
        correlationId: 'corr-123'
      },
      status: 400
    }

    try {
      (httpClient.interceptors.response as any).handlers[0].fulfilled(errorResponse)
    } catch (error: any) {
      expect(error).toBeInstanceOf(ApiError)
      expect(error.message).toBe('Invalid request')
      expect(error.statusCode).toBe(400)
      expect(error.errors).toContain('Field is required')
      expect(error.correlationId).toBe('corr-123')
    }
  })
})
