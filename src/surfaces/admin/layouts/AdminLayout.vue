<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transition-all duration-300 transform lg:translate-x-0 -translate-x-full shadow-2xl overflow-y-auto scrollbar-hide">
      <div class="flex flex-col h-full">
        <!-- Logo Section -->
        <div class="px-8 py-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20 rotate-3">
            <span class="text-white font-bold text-xl font-display">M</span>
          </div>
          <div>
            <h1 class="text-lg font-bold font-display tracking-tight leading-none">
              {{ appName }}
            </h1>
            <p class="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1 font-semibold">
              Collections Dashboard
            </p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-1 mt-2">
          <div
            v-for="(group, index) in navGroups"
            :key="index"
            class="pb-6"
          >
            <h3
              v-if="group.title"
              class="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3"
            >
              {{ group.title }}
            </h3>
            <div class="space-y-1">
              <router-link
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                class="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-slate-800 hover:text-white"
                active-class="bg-brand-600 text-white shadow-lg shadow-brand-600/20"
              >
                <div
                  class="w-5 h-5 rounded-md flex items-center justify-center transition-colors duration-300" 
                  :class="[$route.path === item.to ? 'text-white' : 'text-slate-400 group-hover:text-white']"
                >
                  <!-- Placeholder for icon -->
                  <div class="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
                {{ item.label }}
              </router-link>
            </div>
          </div>
        </nav>

        <!-- Footer / Profile -->
        <div class="p-4 mt-auto">
          <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-brand-500/30">
              <span class="text-xs font-bold text-slate-300">{{ currentUser.email?.charAt(0).toUpperCase() || 'A' }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold truncate">
                {{ currentUser.email?.split('@')[0] || 'User' }}
              </p>
              <p class="text-[10px] text-slate-400 truncate uppercase tracking-widest font-bold">
                Admin Level
              </p>
            </div>
            <button
              class="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors duration-300"
              @click="handleLogout"
            >
              <span class="sr-only">Logout</span>
              →
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-72 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <div class="hidden lg:block">
            <TenantSwitcher />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden sm:flex flex-col items-end mr-4">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ tenantHeaderName }}</span>
            <span class="text-sm font-bold text-slate-900">{{ tenantName }}</span>
          </div>
          <div class="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
          <button class="relative p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-brand-600 transition-all duration-300">
            <span class="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-white" />
            🔔
          </button>
        </div>
      </header>

      <!-- Page Body -->
      <main class="flex-1 p-8 lg:p-12 max-w-[1400px]">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition duration-300 ease-out" 
            enter-from-class="opacity-0 translate-y-4" 
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in" 
            leave-from-class="opacity-100 translate-y-0" 
            leave-to-class="opacity-0 -translate-y-4"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="py-6 px-8 text-center text-xs text-slate-400 border-t border-slate-100 mt-auto">
        &copy; 2026 {{ appName }}. All rights reserved. Premium Collections Platform.
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { appConfig } from '@/core/config/appConfig'
import { useCurrentUser } from '@/core/auth/currentUser'
import TenantSwitcher from '@/modules/tenants/components/TenantSwitcher.vue'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'

const auth0 = useAuth0()
const { currentUser } = useCurrentUser()
const tenantStore = useTenantStore()

const appName = appConfig.appName
const tenantHeaderName = appConfig.api.tenantHeaderName
const tenantName = computed(() => tenantStore.selectedTenantName || 'No tenant selected')

const navGroups = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin' },
    ]
  },
  {
    title: 'Management',
    items: [
      { label: 'Events', to: '/admin/events' },
    ]
  },
  {
    title: 'Transactions',
    items: [
      { label: 'Contributions', to: '/admin/contributions' },
      { label: 'Payments', to: '/admin/payments' },
      { label: 'Receipts', to: '/admin/receipts' },
    ]
  },
  {
    title: 'Finance',
    items: [
      { label: 'Reports', to: '/admin/reports' },
      { label: 'Settlements', to: '/admin/settlements' },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Users', to: '/admin/users' },
      { label: 'Settings', to: '/admin/settings' },
    ]
  },
]

function handleLogout() {
  void auth0.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  })
}
</script>
