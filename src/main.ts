import { createApp } from 'vue'
import App from './App.vue'
import { router } from './app/router'
import { createPinia } from 'pinia'
import { auth0 } from './core/auth/auth0'
import { VueQueryPlugin } from '@tanstack/vue-query'
import './styles/index.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(auth0)
app.use(VueQueryPlugin)

app.mount('#app')
