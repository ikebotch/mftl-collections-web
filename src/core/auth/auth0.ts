import { createAuth0 } from '@auth0/auth0-vue'
import type { App } from 'vue'
import { appConfig } from '@/core/config/appConfig'

const authEnabled = Boolean(appConfig.auth.domain && appConfig.auth.clientId)

let tokenGetter: (() => Promise<string | undefined>) | undefined

export const auth0Plugin = authEnabled
  ? createAuth0({
      domain: appConfig.auth.domain,
      clientId: appConfig.auth.clientId,
      authorizationParams: {
        redirect_uri: appConfig.auth.callbackUrl,
        audience: appConfig.auth.audience || undefined,
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
