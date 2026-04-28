<template>
  <div
    class="min-h-screen font-sans selection:bg-violet-100 selection:text-violet-900 transition-colors duration-500"
    :class="isDesktop ? 'bg-[#f8fafc]' : 'bg-[#060B16]'"
  >
    <!-- Premium Desktop Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 hidden w-72 bg-[#060b13] text-white lg:block shadow-2xl border-r border-navy-900 transition-transform duration-500">
      <div class="flex h-full flex-col">
        <!-- Logo Section -->
        <div class="px-8 py-12">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-none flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Plus class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-black tracking-tight text-white uppercase">
                MFTL
              </h1>
              <p class="text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em]">
                Collector Pro
              </p>
            </div>
          </div>
        </div>

        <nav class="flex-1 px-4 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="group flex items-center justify-between px-4 py-3.5 rounded-none text-sm font-bold transition-all duration-300 hover:bg-white/5"
            active-class="!bg-violet-600/10 text-white border-l-4 border-violet-500"
          >
            <div class="flex items-center gap-4">
              <component
                :is="item.icon"
                class="w-5 h-5 transition-colors duration-300"
                :class="[$route.path === item.to ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300']"
              />
              <span class="tracking-tight uppercase text-[11px] tracking-[0.1em]">{{ item.label }}</span>
            </div>
          </router-link>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-6 mt-auto border-t border-white/5 bg-white/[0.02]">
          <div class="flex items-center gap-4">
            <div class="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
              FC
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-black text-white uppercase tracking-widest truncate">
                Field Collector
              </p>
              <p class="text-[9px] text-slate-500 font-bold uppercase truncate">
                Active Session
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex min-h-screen flex-col lg:pl-72">
      <!-- Mobile Header (Dark) -->
      <header class="sticky top-0 z-40 border-b border-white/10 bg-[#060B16]/90 px-5 pb-4 pt-5 backdrop-blur lg:hidden">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">
              Terminal Alpha
            </p>
            <h1 class="mt-2 text-2xl font-black tracking-tight text-white uppercase italic">
              {{ appName }}
            </h1>
          </div>
          <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-1" />
        </div>
      </header>

      <!-- Desktop Header (Light/Admin Style) -->
      <header class="hidden h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 px-12 lg:flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h2 class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
            System / {{ $route.name?.toString().replace('collector-', '') || 'Overview' }}
          </h2>
          <div class="h-4 w-px bg-slate-200 mx-2" />
          <div class="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-none border border-slate-200">
            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Secure</span>
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <div class="text-right">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Local Station
            </p>
            <p class="text-xs font-black text-slate-900 uppercase tracking-tight">
              Accra Terminal 01
            </p>
          </div>
          <div class="h-10 w-px bg-slate-200" />
          <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1.5 px-4 rounded-none">
            <div class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span class="text-[10px] font-black text-slate-700 uppercase tracking-widest">Live Sync</span>
          </div>
        </div>
      </header>

      <main
        class="flex-1 transition-all duration-500"
        :class="isDesktop ? 'p-12 lg:p-16 max-w-[1400px]' : 'px-5 py-8'"
      >
        <router-view v-slot="{ Component }">
          <transition
            name="fade-slide"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Mobile Nav (Dark) -->
      <nav
        class="fixed inset-x-0 bottom-0 z-50 mx-auto w-full border-t border-white/10 bg-[#09101D]/98 px-3 pb-[max(env(safe-area-inset-bottom),0.9rem)] pt-3 backdrop-blur-xl lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        aria-label="Collector mobile navigation"
      >
        <div class="grid grid-cols-5 gap-2 max-w-md mx-auto">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex flex-col items-center gap-2 rounded-none px-2 py-2 text-[10px] font-black uppercase tracking-tight text-slate-500 transition"
            active-class="text-violet-400"
          >
            <div
              :class="[
                'flex h-12 w-12 items-center justify-center rounded-none border transition-all duration-300',
                $route.path === item.to
                  ? 'border-violet-500 bg-violet-600 text-white shadow-[0_5px_15px_rgba(124,58,237,0.4)] scale-110'
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { appConfig } from '@/core/config/appConfig'
import { CalendarDays, FileText, Home, LayoutGrid, Plus } from 'lucide-vue-next'

const appName = appConfig.appName
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

const isDesktop = computed(() => windowWidth.value >= 1024)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const navItems = [
  { label: 'Feed', to: '/collector', icon: Home },
  { label: 'Events', to: '/collector/events', icon: CalendarDays },
  { label: 'Collect', to: '/collector/contributions/new', icon: Plus },
  { label: 'History', to: '/collector/history', icon: FileText },
  { label: 'Menu', to: '/collector/history', icon: LayoutGrid },
]
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
