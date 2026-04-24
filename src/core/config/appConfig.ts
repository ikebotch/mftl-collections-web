import { env } from './env'

export const appConfig = {
  appName: env.VITE_APP_NAME,
  api: {
    baseUrl: env.VITE_API_BASE_URL,
    version: env.VITE_API_VERSION,
    versionedBaseUrl: `${env.VITE_API_BASE_URL.replace(/\/$/, '')}/${env.VITE_API_VERSION}`,
    tenantHeaderName: env.VITE_TENANT_HEADER_NAME,
  },
  auth: {
    domain: env.VITE_AUTH0_DOMAIN,
    clientId: env.VITE_AUTH0_CLIENT_ID,
    audience: env.VITE_AUTH0_AUDIENCE,
    callbackUrl: env.VITE_AUTH0_CALLBACK_URL,
    devBypass: env.VITE_AUTH_DEV_BYPASS,
  },
} as const

export type AppConfig = typeof appConfig
