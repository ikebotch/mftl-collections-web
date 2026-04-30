import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { useAuth0 } from '@auth0/auth0-vue'
import { watch } from 'vue'
import App from './App.vue'
import { router } from './app/router'
import { installAuth, isAuthConfigured, registerAccessTokenProvider } from './core/auth/auth0'
import { queryClient } from './core/api/queryClient'
import './styles/index.css'

const app = createApp(App)
const pinia = createPinia()

installAuth(app)
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient })

if (isAuthConfigured()) {
  app.runWithContext(() => {
    const auth0 = useAuth0()

    const waitForAuthReady = async () => {
      if (!auth0.isLoading.value) {
        return
      }

      await new Promise<void>((resolve) => {
        const stop = watch(auth0.isLoading, (loading) => {
          if (!loading) {
            stop()
            resolve()
          }
        })
      })
    }

    registerAccessTokenProvider(async () => {
      await waitForAuthReady()

      if (!auth0.isAuthenticated.value) {
        return undefined
      }

      return auth0.getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE || undefined,
          scope: 'openid profile email offline_access',
        },
      })
    })
  })
}

app.mount('#app')
