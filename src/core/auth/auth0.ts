import { createAuth0 } from '@auth0/auth0-vue'
import type { App } from 'vue'
import { appConfig } from '@/core/config/appConfig'
import type { AppPermission } from './permissions'

const authEnabled = Boolean(appConfig.auth.domain && appConfig.auth.clientId) && !appConfig.auth.devBypass

let tokenGetter: (() => Promise<string | undefined>) | undefined

export const auth0Plugin = authEnabled
  ? createAuth0({
      domain: appConfig.auth.domain,
      clientId: appConfig.auth.clientId,
      authorizationParams: {
        redirect_uri: appConfig.auth.callbackUrl,
        audience: appConfig.auth.audience || undefined,
        scope: 'openid profile email offline_access',
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
    })
  : null

export function installAuth(app: App<Element>) {
  if (auth0Plugin) {
    app.use(auth0Plugin)
  }
}

export function registerAccessTokenProvider(provider: () => Promise<string | undefined>) {
  tokenGetter = provider
}

export async function getAccessToken(): Promise<string | undefined> {
  if (!tokenGetter) {
    return undefined
  }

  try {
    return await tokenGetter()
  } catch {
    return undefined
  }
}

export function isAuthConfigured(): boolean {
  return authEnabled
}

export function isDevAuthBypassEnabled(): boolean {
  return appConfig.auth.devBypass
}

export function shouldBypassAuth(): boolean {
  return isDevAuthBypassEnabled() || !isAuthConfigured()
}

export interface DevAuthUser {
  sub: string
  email: string
  name: string
  picture: string
  role: string
  permissions: AppPermission[]
}

export function createDevAuthUser(): DevAuthUser {
  return {
    sub: 'dev-user',
    email: 'dev-admin@mftl.local',
    name: 'Dev Admin',
    picture: '',
    role: 'Admin',
    permissions: [
      'events:read',
      'events:write',
      'recipient-funds:write',
      'reports:read',
      'collector:write',
      'payments:read',
      'users:read',
    ],
  }
}
