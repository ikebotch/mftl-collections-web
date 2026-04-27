<template>
  <div class="min-h-screen bg-[#F9F9FB] text-slate-900 font-sans selection:bg-violet-100 selection:text-violet-900">
    <header v-if="$route.name !== 'storefront-contribute'" class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 h-20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-violet-600/20">
            <span class="text-white font-black text-xl font-display">M</span>
          </div>
          <div>
            <h1 class="text-lg font-black font-display tracking-tight leading-none text-[#0F172A]">
              {{ appName }}
            </h1>
            <p class="text-[10px] uppercase tracking-[0.2em] text-[#64748B] mt-1 font-black">
              Public Contribution Platform
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3 text-right">
            <div class="w-8 h-8 rounded-full border-2 border-[#F5F3FF] flex items-center justify-center text-violet-600">
              <ShieldCheck class="w-4 h-4" />
            </div>
            <div class="hidden sm:block">
              <p class="text-[9px] uppercase tracking-[0.2em] text-[#64748B] font-black">Secure Payment</p>
              <p class="text-[11px] font-black text-[#0F172A]">Verified by MFTL</p>
            </div>
          </div>
          
          <div class="w-px h-8 bg-slate-200 hidden sm:block" />
          
          <div class="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#10B981] shadow-sm">
            <Lock class="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>

    <main>
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
  </div>
</template>

<script setup lang="ts">
import { appConfig } from '@/core/config/appConfig'
import { ShieldCheck, Lock } from 'lucide-vue-next'

const appName = appConfig.appName
</script>

<style scoped>
.font-black {
  font-weight: 950;
}
</style>
