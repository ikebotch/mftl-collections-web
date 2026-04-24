import { createApp } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { useAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import { router } from './app/router'
import { installAuth, isAuthConfigured, registerAccessTokenProvider } from './core/auth/auth0'
import './styles/index.css'

const app = createApp(App)
const pinia = createPinia()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

installAuth(app)
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient })

if (isAuthConfigured()) {
  app.runWithContext(() => {
    const auth0 = useAuth0()
    registerAccessTokenProvider(async () => auth0.getAccessTokenSilently())
  })
}

app.mount('#app')
