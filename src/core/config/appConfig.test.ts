import { describe, it, expect, vi } from 'vitest'

describe('AppConfig', () => {
  it('loads configuration from env', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://test-api')
    vi.stubEnv('VITE_AUTH0_DOMAIN', 'test-domain')
    vi.stubEnv('VITE_AUTH0_CLIENT_ID', 'test-client')
    vi.stubEnv('VITE_AUTH0_AUDIENCE', 'test-audience')
    vi.stubEnv('VITE_TENANT_HEADER_NAME', 'X-Test-Tenant')

    // We have to reset modules to force re-evaluation of env.ts
    vi.resetModules()
    const { appConfig } = await import('./appConfig')

    expect(appConfig.api.baseUrl).toBe('http://test-api')
    expect(appConfig.api.tenantHeaderName).toBe('X-Test-Tenant')
    expect(appConfig.auth.domain).toBe('test-domain')
    expect(appConfig.auth.clientId).toBe('test-client')
    expect(appConfig.auth.audience).toBe('test-audience')
  })
})
