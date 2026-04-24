<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_#d1fae5,_#f8fafc_50%,_#ecfeff)]">
    <header class="border-b border-white/70 bg-white/70 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
            Public contribution
          </p>
          <h1 class="text-xl font-semibold text-slate-950">
            {{ appName }}
          </h1>
        </div>
        <p class="text-sm text-slate-500">
          Secure collection flow
        </p>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-5 py-10">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { appConfig } from '@/core/config/appConfig'

const appName = appConfig.appName
</script>
