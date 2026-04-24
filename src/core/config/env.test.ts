import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

describe('parseEnv', () => {
  it('loads required frontend config values', () => {
    const env = parseEnv({
      VITE_APP_NAME: 'MFTL Collections',
      VITE_API_BASE_URL: 'http://localhost:7072/api',
      VITE_API_VERSION: 'v1',
      VITE_AUTH0_DOMAIN: '',
      VITE_AUTH0_CLIENT_ID: '',
      VITE_AUTH0_AUDIENCE: '',
      VITE_AUTH0_CALLBACK_URL: 'http://localhost:5174/auth/callback',
      VITE_TENANT_HEADER_NAME: 'X-Tenant-Id',
    })

    expect(env.VITE_API_BASE_URL).toBe('http://localhost:7072/api')
    expect(env.VITE_API_VERSION).toBe('v1')
  })
})
