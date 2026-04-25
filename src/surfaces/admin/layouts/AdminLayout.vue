<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
    <AppToast />
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-72 bg-[#060b13] text-white transition-all duration-300 transform lg:translate-x-0 -translate-x-full overflow-y-auto border-r border-navy-900">
      <div class="flex flex-col h-full">
        <!-- Logo Section -->
        <div class="px-8 py-10">
          <TenantSwitcher />
          <p class="text-[10px] text-slate-400 mt-4 leading-relaxed font-medium uppercase tracking-[0.2em]">
            Collect. Impact. Transform.
          </p>
        </div>


        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-10 mt-2">
          <div
            v-for="(group, index) in navGroups"
            :key="index"
          >
            <h3
              v-if="group.title"
              class="px-4 text-[9px] uppercase tracking-[0.25em] text-slate-500 font-black mb-4"
            >
              {{ group.title }}
            </h3>
            <div class="space-y-1">
              <router-link
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                class="group flex items-center justify-between px-4 py-3 rounded-none text-sm font-semibold transition-all duration-300 hover:bg-white/5"
                active-class="!bg-violet-600/10 text-white border-l-4 border-violet-500"
              >
                <div class="flex items-center gap-3">
                  <component
                    :is="item.icon"
                    class="w-4.5 h-4.5 transition-colors duration-300"
                    :class="[$route.path === item.to ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300']"
                  />
                  <span 
                    class="tracking-tight transition-colors duration-300"
                    :class="[$route.path === item.to ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']"
                  >{{ item.label }}</span>
                </div>
                <div 
                  v-if="item.badge" 
                  class="px-2 py-0.5 rounded-none bg-violet-500/20 text-violet-400 text-[9px] font-black uppercase tracking-widest border border-violet-500/30"
                >
                  {{ item.badge }}
                </div>
              </router-link>
            </div>
          </div>
        </nav>

        <!-- Footer / Profile Card -->
        <div class="p-4 mt-auto">
          <div class="p-4 rounded-none bg-navy-900/30 border border-navy-800/50 flex items-center gap-3">
            <div class="w-10 h-10 rounded-none bg-slate-800 flex items-center justify-center overflow-hidden border border-navy-700/50 relative">
              <img
                v-if="currentUser.picture"
                :src="currentUser.picture"
                class="w-full h-full object-cover"
              >
              <span
                v-else
                class="text-xs font-bold text-slate-400"
              >{{ currentUser.name?.charAt(0) || 'U' }}</span>
              <div class="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-navy-950 rounded-none transform rotate-45" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-black truncate text-white tracking-tight">
                {{ currentUser.name || 'Admin User' }}
              </p>
              <p class="text-[10px] text-slate-500 truncate uppercase tracking-widest font-black italic">
                {{ currentUser.role || 'Super Admin' }}
              </p>
            </div>
            <button
              class="p-2 rounded-none hover:bg-navy-800 text-slate-500 hover:text-white transition-colors duration-300"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Impact Summary Mini-Card -->
          <div class="mt-4 p-5 rounded-none bg-violet-600/5 border border-violet-500/20">
            <p class="text-[9px] text-violet-400 font-black uppercase tracking-[0.2em] mb-3">
              Performance Index
            </p>
            <div class="flex items-end justify-between mb-3">
              <span class="text-lg font-black text-white italic tracking-tight">$24,582.50</span>
              <span class="text-[10px] text-emerald-400 font-black">↑ 12.5%</span>
            </div>
            <div class="h-1 bg-violet-900/50 rounded-none overflow-hidden">
              <div class="h-full bg-violet-500 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-72 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 px-10 flex items-center justify-between">
        <!-- Search bar -->
        <div class="flex-1 max-w-xl relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search operational data..." 
            class="w-full bg-slate-50 border border-slate-200 rounded-none py-2.5 pl-11 pr-4 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
          >
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-none border border-slate-200">
            <span class="text-[9px] font-black text-slate-400">⌘K</span>
          </div>
        </div>

        <div class="flex items-center gap-8">
          <div class="flex items-center gap-2">
            <!-- Language Selector -->
            <div class="flex items-center bg-slate-50 rounded-none p-1 mr-4 border border-slate-200">
              <div class="p-1.5 mr-1 text-slate-400">
                <Globe class="w-3.5 h-3.5" />
              </div>
              <button 
                v-for="loc in availableLocales" 
                :key="loc"
                class="px-2 py-1 rounded-none text-[10px] font-black uppercase tracking-widest transition-all"
                :class="currentLocale === loc ? 'bg-white text-violet-600 border border-slate-200' : 'text-slate-400 hover:text-slate-600'"
                @click="setLocale(loc)"
              >
                {{ loc }}
              </button>
            </div>

            <button class="relative p-2.5 rounded-none text-slate-500 hover:bg-slate-50 hover:text-violet-600 transition-all duration-300">
              <Bell class="w-4.5 h-4.5" />
              <span class="absolute top-2 right-2 w-4 h-4 bg-violet-600 text-[8px] font-black text-white flex items-center justify-center rounded-none border-2 border-white transform rotate-12">12</span>
            </button>
            <button class="p-2.5 rounded-none text-slate-500 hover:bg-slate-50 hover:text-violet-600 transition-all duration-300">
              <Settings class="w-4.5 h-4.5" />
            </button>
          </div>

          <div class="w-px h-8 bg-slate-200" />

          <!-- User Info with Dropdown Trigger -->
          <button class="flex items-center gap-4 p-1.5 pr-4 rounded-none hover:bg-slate-50 transition-all duration-300 group">
            <div class="w-10 h-10 rounded-none overflow-hidden border border-slate-200 shadow-sm relative p-0.5 bg-white">
              <img
                v-if="currentUser.picture"
                :src="currentUser.picture"
                class="w-full h-full object-cover"
              >
              <div
                v-else
                class="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm italic"
              >
                {{ currentUser.name?.charAt(0) || 'A' }}
              </div>
            </div>
            <div class="hidden sm:flex flex-col items-start text-left">
              <span class="text-sm font-black text-slate-900 leading-none tracking-tight">{{ currentUser.name || 'Isaac Botchway' }}</span>
              <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1.5 italic">System Administrator</span>
            </div>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-colors" />
          </button>
        </div>
      </header>

      <!-- Page Body -->
      <main class="flex-1 p-10 lg:p-12 max-w-[1600px] mx-auto w-full">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition duration-500 ease-out" 
            enter-from-class="opacity-0 translate-y-4" 
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-300 ease-in" 
            leave-from-class="opacity-100 translate-y-0" 
            leave-to-class="opacity-0 -translate-y-4"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="py-8 px-12 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-t border-slate-100 bg-white/50">
        <div>&copy; 2026 {{ appName }} &bull; Operational Integrity Systems</div>
        <div class="flex items-center gap-8">
          <a
            href="#"
            class="hover:text-violet-600 transition-colors"
          >System Status</a>
          <a
            href="#"
            class="hover:text-violet-600 transition-colors"
          >Documentation</a>
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
import { useCopy } from '@/core/i18n/useCopy'
import TenantSwitcher from '@/modules/tenants/components/TenantSwitcher.vue'
import AppToast from '@/shared/components/feedback/AppToast.vue'
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
  UserCheck,
  Globe
} from 'lucide-vue-next'

const { copy, setLocale, currentLocale, availableLocales } = useCopy()
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
