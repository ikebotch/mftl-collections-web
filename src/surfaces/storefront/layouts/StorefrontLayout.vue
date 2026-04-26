<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 h-20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/20 rotate-3">
            <span class="text-white font-bold text-xl font-display">M</span>
          </div>
          <div>
            <h1 class="text-lg font-bold font-display tracking-tight leading-none text-slate-900">
              {{ appName }}
            </h1>
            <p class="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-bold">
              Public Contribution
            </p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="hidden sm:block text-right">
            <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Secure Payment
            </p>
            <p class="text-xs font-bold text-slate-600">
              Verified by MFTL
            </p>
          </div>
          <div class="w-px h-8 bg-slate-100 mx-2 hidden sm:block" />
          <div class="p-2 rounded-full bg-emerald-50 text-emerald-600">
            <span class="sr-only">Secure</span>
            🔒
          </div>
        </div>
      </div>
    </header>
    <main class="max-w-3xl mx-auto px-6 py-12 md:py-24">
      <router-view v-slot="{ Component }">
        <transition 
          enter-active-class="transition duration-700 ease-out" 
          enter-from-class="opacity-0 translate-y-12" 
          enter-to-class="opacity-100 translate-y-0"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="py-12 border-t border-slate-100 mt-12 bg-white">
      <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-3 grayscale opacity-50">
          <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <span class="text-white font-bold text-sm font-display">M</span>
          </div>
          <span class="font-bold font-display text-slate-900 tracking-tight">{{ appName }}</span>
        </div>
        <p class="text-xs font-medium text-slate-500">
          &copy; 2026 {{ appName }}. Powered by MFTL Ecosystem. All payments are securely processed.
        </p>
        <div class="flex gap-6">
          <a
            href="#"
            class="text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest"
          >Privacy</a>
          <a
            href="#"
            class="text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest"
          >Terms</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { appConfig } from '@/core/config/appConfig'

const appName = appConfig.appName
</script>
