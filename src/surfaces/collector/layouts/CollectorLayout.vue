<template>
  <div class="min-h-screen bg-[#060B16] text-white">
    <div class="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.28),_transparent_28%),linear-gradient(180deg,_#0A1020_0%,_#060B16_100%)] pb-24 shadow-[0_0_80px_rgba(5,8,18,0.75)] lg:max-w-5xl lg:px-6">
      <header class="sticky top-0 z-20 border-b border-white/10 bg-[#060B16]/90 px-5 pb-4 pt-5 backdrop-blur">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/90">
              Field collector
            </p>
            <h1 class="mt-2 text-2xl font-semibold tracking-tight text-white">
              {{ appName }}
            </h1>
          </div>
          <div class="flex items-center gap-2">
            <div class="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Mobile mode
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 px-5 py-5 lg:px-0">
        <router-view />
      </main>

      <nav
        class="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-white/10 bg-[#09101D]/95 px-3 pb-[max(env(safe-area-inset-bottom),0.9rem)] pt-3 backdrop-blur lg:static lg:mx-0 lg:mt-6 lg:max-w-none lg:rounded-[2rem] lg:border"
        aria-label="Collector mobile navigation"
      >
        <div class="grid grid-cols-5 gap-2">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex flex-col items-center gap-2 rounded-2xl px-2 py-2 text-[11px] font-medium text-slate-400 transition"
            active-class="text-violet-300"
          >
            <div
              :class="[
                'flex h-12 w-12 items-center justify-center rounded-full border transition',
                item.isPrimary
                  ? 'border-violet-400/50 bg-violet-500 text-white shadow-[0_10px_30px_rgba(124,58,237,0.45)]'
                  : 'border-white/10 bg-white/5',
              ]"
            >
              <component
                :is="item.icon"
                class="h-5 w-5"
              />
            </div>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appConfig } from '@/core/config/appConfig'
import { CalendarDays, FileText, Home, Menu, Plus } from 'lucide-vue-next'

const appName = appConfig.appName

const navItems = [
  { label: 'Dashboard', to: '/collector', icon: Home },
  { label: 'Events', to: '/collector/events', icon: CalendarDays },
  { label: 'New', to: '/collector/contributions/new', icon: Plus, isPrimary: true },
  { label: 'History', to: '/collector/history', icon: FileText },
  { label: 'Menu', to: '/collector/history', icon: Menu },
]
</script>
