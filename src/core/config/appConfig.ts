import { env } from './env'

export const appConfig = {
  api: {
    baseUrl: env.VITE_API_BASE_URL,
    tenantHeaderName: env.VITE_TENANT_HEADER_NAME,
  },
  auth: {
    domain: env.VITE_AUTH0_DOMAIN,
    clientId: env.VITE_AUTH0_CLIENT_ID,
    audience: env.VITE_AUTH0_AUDIENCE,
  },
} as const

export type AppConfig = typeof appConfig
