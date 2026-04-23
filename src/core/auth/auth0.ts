import { createAuth0 } from '@auth0/auth0-vue'
import { appConfig } from '../config/appConfig'

export const auth0 = createAuth0({
  domain: appConfig.auth.domain,
  clientId: appConfig.auth.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin + '/auth/callback',
    audience: appConfig.auth.audience,
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
})

export async function getAccessToken() {
  return await auth0.getAccessTokenSilently()
}
