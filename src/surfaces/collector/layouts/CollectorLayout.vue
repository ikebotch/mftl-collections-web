<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <header class="border-b border-white/10 bg-slate-900/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Collector mode
          </p>
          <h1 class="text-2xl font-semibold">
            {{ appName }}
          </h1>
        </div>
        <nav
          class="flex flex-wrap gap-2"
          aria-label="Collector navigation"
        >
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
            active-class="bg-cyan-300 text-slate-950"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl space-y-8 px-5 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { appConfig } from '@/core/config/appConfig'

const appName = appConfig.appName

const navItems = [
  { label: 'Dashboard', to: '/collector' },
  { label: 'Events', to: '/collector/events' },
  { label: 'New contribution', to: '/collector/contributions/new' },
  { label: 'History', to: '/collector/history' },
]
</script>
