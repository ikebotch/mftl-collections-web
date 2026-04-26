<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'

const { isAuthenticated, isLoading, error } = useAuth0()
const router = useRouter()

function navigate() {
  if (isAuthenticated.value) {
    // If we have a state from Auth0, it might contain the original path
    // But for now, just go to admin
    router.replace('/admin')
  } else if (error.value) {
    console.error('Auth error:', error.value)
    router.replace('/auth/login')
  }
}

onMounted(() => {
  if (!isLoading.value) {
    navigate()
  }
})

watch([isLoading, isAuthenticated], ([loading]) => {
  if (!loading) {
    navigate()
  }
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-50">
    <div class="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-slate-950/40">
      <div v-if="!error" class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-300/20 border-t-teal-300" />
      <div v-else class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 class="text-2xl font-semibold">
        {{ error ? 'Authentication Error' : 'Completing sign-in' }}
      </h1>
      <p class="mt-3 text-sm text-slate-300">
        {{ error ? error.message : 'Your secure session is being prepared. You’ll be redirected in a moment.' }}
      </p>

      <div v-if="error" class="mt-6">
        <button 
          @click="router.replace('/auth/login')"
          class="rounded-xl bg-white px-6 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  </main>
</template>
