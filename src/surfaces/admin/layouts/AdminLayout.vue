<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-72 bg-[#060b13] text-white transition-all duration-300 transform lg:translate-x-0 -translate-x-full shadow-2xl overflow-y-auto border-r border-navy-900">
      <div class="flex flex-col h-full">
        <!-- Logo Section -->
        <div class="px-8 py-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20 rotate-3 shrink-0">
              <Heart class="text-white w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 class="text-xl font-bold font-display tracking-tight leading-none text-white">
                MFTL
              </h1>
              <p class="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1 font-bold">
                Collections
              </p>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 mt-4 leading-relaxed font-medium">
            Collect. Impact. Transform Lives.
          </p>
        </div>

        <!-- Tenant Selector -->
        <TenantSelector />

        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-8 mt-2">
          <div
            v-for="(group, index) in navGroups"
            :key="index"
          >
            <h3
              v-if="group.title"
              class="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4"
            >
              {{ group.title }}
            </h3>
            <div class="space-y-1">
              <router-link
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                class="group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5"
                active-class="!bg-violet-600 text-white shadow-lg shadow-violet-600/40 border-l-4 border-white"
              >
                <div class="flex items-center gap-3">
                  <component
                    :is="item.icon"
                    class="w-5 h-5 transition-colors duration-300"
                    :class="[$route.path === item.to ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']"
                  />
                  <span>{{ item.label }}</span>
                </div>
                <div 
                  v-if="item.badge" 
                  class="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest"
                >
                  {{ item.badge }}
                </div>
              </router-link>
            </div>
          </div>
        </nav>

        <!-- Footer / Profile Card -->
        <div class="p-4 mt-auto">
          <div class="p-4 rounded-2xl bg-navy-900/50 border border-navy-800/50 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-navy-700/50 relative">
              <img
                v-if="currentUser.picture"
                :src="currentUser.picture"
                class="w-full h-full object-cover"
              >
              <span
                v-else
                class="text-xs font-bold text-slate-400"
              >{{ currentUser.name?.charAt(0) || 'U' }}</span>
              <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-navy-950 rounded-full" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold truncate text-white">
                {{ currentUser.name || 'Admin User' }}
              </p>
              <p class="text-[10px] text-slate-500 truncate uppercase tracking-widest font-bold">
                {{ currentUser.role || 'Super Admin' }}
              </p>
            </div>
            <button
              class="p-2 rounded-lg hover:bg-navy-800 text-slate-500 hover:text-white transition-colors duration-300"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Impact Summary Mini-Card -->
          <div class="mt-4 p-4 rounded-2xl bg-violet-600/10 border border-violet-500/20">
            <p class="text-[10px] text-violet-300 font-bold uppercase tracking-widest mb-2">
              Your impact this month
            </p>
            <div class="flex items-end justify-between">
              <span class="text-lg font-bold text-white">$24,582.50</span>
              <span class="text-[10px] text-emerald-400 font-bold">↑ 12.5%</span>
            </div>
            <div class="mt-2 h-1 bg-violet-900/50 rounded-full overflow-hidden">
              <div class="h-full bg-violet-500 w-3/4 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-72 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
        <!-- Search bar -->
        <div class="flex-1 max-w-xl relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search events, funds, donors, payments..." 
            class="w-full bg-slate-100/50 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
          >
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
            <span class="text-[10px] font-bold text-slate-600">⌘K</span>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <button class="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-violet-600 transition-all duration-300">
              <Bell class="w-5 h-5" />
              <span class="absolute top-2 right-2 w-4 h-4 bg-violet-500 text-[9px] font-black text-white flex items-center justify-center rounded-full border-2 border-white">12</span>
            </button>
            <button class="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-violet-600 transition-all duration-300">
              <Settings class="w-5 h-5" />
            </button>
          </div>

          <div class="w-px h-8 bg-slate-200" />

          <!-- User Info with Dropdown Trigger -->
          <button class="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-all duration-300 group">
            <div class="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200">
              <img
                v-if="currentUser.picture"
                :src="currentUser.picture"
                class="w-full h-full object-cover"
              >
              <div
                v-else
                class="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-sm"
              >
                {{ currentUser.name?.charAt(0) || 'A' }}
              </div>
            </div>
            <div class="hidden sm:flex flex-col items-start text-left">
              <span class="text-sm font-bold text-slate-900 leading-none">{{ currentUser.name || 'Isaac Botchway' }}</span>
              <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Admin</span>
            </div>
            <ChevronDown class="w-4 h-4 text-slate-500 group-hover:text-violet-600 transition-colors" />
          </button>
        </div>
      </header>

      <!-- Page Body -->
      <main class="flex-1 p-8 lg:p-10">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition duration-400 ease-out" 
            enter-from-class="opacity-0 translate-y-8" 
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-300 ease-in" 
            leave-from-class="opacity-100 translate-y-0" 
            leave-to-class="opacity-0 -translate-y-8"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="py-6 px-10 flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-widest border-t border-slate-100 bg-white/50">
        <div>&copy; 2026 {{ appName }}. Collect. Impact. Transform.</div>
        <div class="flex items-center gap-6">
          <a
            href="#"
            class="hover:text-violet-600 transition-colors"
          >Documentation</a>
          <a
            href="#"
            class="hover:text-violet-600 transition-colors"
          >Support</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { appConfig } from '@/core/config/appConfig'
import { useCurrentUser } from '@/core/auth/currentUser'
import { isAuthConfigured, shouldBypassAuth } from '@/core/auth/auth0'
import { useAuth0 } from '@auth0/auth0-vue'
import TenantSelector from '@/modules/tenants/components/TenantSelector.vue'
import { useCopy } from '@/core/i18n/useCopy'
import { 
  LayoutDashboard, 
  Calendar, 
  Heart, 
  CircleDollarSign, 
  Wallet, 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-vue-next'

const { copy } = useCopy()
const auth0 = !shouldBypassAuth() && isAuthConfigured() ? useAuth0() : null
const { currentUser } = useCurrentUser()

const appName = appConfig.appName

const navGroups = computed(() => [
  {
    title: copy.value.admin.sidebar.groups.general,
    items: [
      { label: copy.value.admin.sidebar.nav.overview, to: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: copy.value.admin.sidebar.groups.management,
    items: [
      { label: copy.value.admin.sidebar.nav.events, to: '/admin/events', icon: Calendar },
    ]
  },
  {
    title: copy.value.admin.sidebar.groups.finance,
    items: [
      { label: copy.value.admin.sidebar.nav.contributions, to: '/admin/contributions', icon: CircleDollarSign },
      { label: copy.value.admin.sidebar.nav.selfDonations, to: '/admin/self-donations', icon: Heart, badge: 'NEW' },
      { label: copy.value.admin.sidebar.nav.payments, to: '/admin/payments', icon: Wallet },
      { label: copy.value.admin.sidebar.nav.donors, to: '/admin/donors', icon: Users },
    ]
  },
  {
    title: copy.value.admin.sidebar.groups.operations,
    items: [
      { label: copy.value.admin.sidebar.nav.collectors, to: '/admin/collectors', icon: UserCheck, badge: 'NEW' },
      { label: copy.value.admin.sidebar.nav.reports, to: '/admin/reports', icon: BarChart3 },
    ]
  },
  {
    title: copy.value.admin.sidebar.groups.system,
    items: [
      { label: copy.value.admin.sidebar.nav.settlements, to: '/admin/settlements', icon: ShieldCheck },
      { label: copy.value.admin.sidebar.nav.users, to: '/admin/users', icon: UserCheck },
      { label: copy.value.admin.sidebar.nav.settings, to: '/admin/settings', icon: Settings },
    ]
  },
])

function handleLogout() {
  if (!auth0) {
    window.location.assign(window.location.origin)
    return
  }

  void auth0.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  })
}
</script>
