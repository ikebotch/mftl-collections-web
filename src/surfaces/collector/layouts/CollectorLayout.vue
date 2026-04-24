<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_25%),linear-gradient(180deg,_#020617_0%,_#0f172a_42%,_#111827_100%)] text-slate-50">
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
    <header class="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div class="space-y-1">
          <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
            Collector mode
          </p>
          <h1 class="text-2xl font-semibold tracking-tight text-white">
            {{ appName }}
          </h1>
          <p class="text-sm text-slate-400">
            Fast, reliable field collection for on-the-ground operators.
          </p>
        </div>
        <nav
          class="flex flex-wrap gap-2"
          aria-label="Collector navigation"
        >
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
            active-class="border-cyan-300/30 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/20"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </div>
    </header>
    <main class="relative mx-auto max-w-7xl space-y-8 px-5 py-8">
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
