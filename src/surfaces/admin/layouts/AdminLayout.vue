<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
    <AppToast />
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-72 bg-[#060b13] text-white transition-all duration-300 transform lg:translate-x-0 -translate-x-full border-r border-navy-900">
      <div class="flex flex-col h-full">
        <!-- Logo Section -->
        <div class="px-8 py-10 LogoSection">
          <TenantSwitcher />
          <p class="text-[10px] text-slate-400 mt-4 leading-relaxed font-medium uppercase tracking-[0.2em]">
            Collect. Impact. Transform.
          </p>
        </div>


        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-10 mt-2 overflow-y-auto custom-scrollbar">
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
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-72 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[60] px-10 flex items-center justify-between">
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
            <!-- Minimalist Language Dropdown -->
            <div class="relative">
              <button 
                class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/50 border border-slate-200/60 hover:bg-slate-100 transition-all duration-300 group ml-4"
                @click="isLanguageDropdownOpen = !isLanguageDropdownOpen"
              >
                <Globe class="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">{{ currentLocale }}</span>
                <ChevronDown 
                  class="w-3 h-3 text-slate-400 transition-transform duration-300"
                  :class="{ 'rotate-180': isLanguageDropdownOpen }"
                />
              </button>

              <div 
                v-if="isLanguageDropdownOpen"
                class="absolute top-full left-4 mt-3 w-32 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl z-[70] p-1.5 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <button 
                  v-for="loc in availableLocales" 
                  :key="loc"
                  class="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:bg-slate-50"
                  :class="currentLocale === loc ? 'text-violet-600 bg-violet-50/50' : 'text-slate-500'"
                  @click="setLocale(loc); isLanguageDropdownOpen = false"
                >
                  {{ loc }}
                </button>
              </div>
            </div>

            <button class="relative p-2.5 rounded-none text-slate-500 hover:bg-slate-50 hover:text-violet-600 transition-all duration-300">
              <Bell class="w-4.5 h-4.5" />
              <span class="absolute top-2 right-2 w-4 h-4 bg-violet-600 text-[8px] font-black text-white flex items-center justify-center rounded-full border-2 border-white transform rotate-12">12</span>
            </button>
            <router-link
              to="/admin/settings"
              class="p-2.5 rounded-none text-slate-500 hover:bg-slate-50 hover:text-violet-600 transition-all duration-300"
            >
              <Settings class="w-4.5 h-4.5" />
            </router-link>
          </div>

          <div class="w-px h-8 bg-slate-200" />

          <!-- User Info with Dropdown Trigger -->
          <div class="relative">
            <button 
              class="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-all duration-300 group ml-2"
              @click="isUserDropdownOpen = !isUserDropdownOpen"
            >
              <div class="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm relative p-0.5 bg-white">
                <img
                  v-if="currentUser.picture"
                  :src="currentUser.picture"
                  class="w-full h-full object-cover rounded-full"
                >
                <div
                  v-else
                  class="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm italic rounded-full"
                >
                  {{ currentUser.name?.charAt(0) || 'A' }}
                </div>
              </div>
              <span class="hidden sm:block text-[11px] font-black text-slate-900 uppercase tracking-widest">{{ formattedUserName }}</span>
              <ChevronDown 
                class="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-transform duration-300"
                :class="{ 'rotate-180': isUserDropdownOpen }"
              />
            </button>

            <!-- Premium User Dropdown -->
            <div 
              v-if="isUserDropdownOpen"
              class="absolute top-full right-0 mt-4 w-72 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl z-[70] animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div class="p-6 border-b border-slate-100 bg-slate-50/30">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Authenticated as
                </p>
                <p class="text-sm font-black text-slate-900 truncate uppercase tracking-tight mb-1">
                  {{ currentUser.name }}
                </p>
                <p class="text-[11px] font-medium text-slate-500 truncate italic">
                  {{ currentUser.email }}
                </p>
              </div>
              
              <div class="p-2">
                <router-link
                  to="/admin/settings"
                  class="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-violet-600 transition-colors"
                  @click="isUserDropdownOpen = false"
                >
                  <User class="w-4 h-4" />
                  Settings
                </router-link>
                <router-link
                  to="/admin/users"
                  class="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-violet-600 transition-colors"
                  @click="isUserDropdownOpen = false"
                >
                  <ShieldCheck class="w-4 h-4" />
                  Users
                </router-link>
              </div>

              <div class="p-2 border-t border-slate-100">
                <button
                  class="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-rose-600 uppercase tracking-widest hover:bg-rose-50 transition-colors"
                  @click="handleLogout"
                >
                  <LogOut class="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
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
  PlusCircle,
  Globe,
  Building2,
  User
} from 'lucide-vue-next'

const { copy, setLocale, currentLocale, availableLocales } = useCopy()
const auth0 = !shouldBypassAuth() && isAuthConfigured() ? useAuth0() : null
const { currentUser } = useCurrentUser()
const isUserDropdownOpen = ref(false)
const isLanguageDropdownOpen = ref(false)

const formattedUserName = computed(() => {
  if (!currentUser.value.name) return ''
  const parts = currentUser.value.name.split(' ')
  return parts[0]
})

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  
  if (isUserDropdownOpen.value && !target.closest('.relative')) {
    isUserDropdownOpen.value = false
  }
  
  if (isLanguageDropdownOpen.value && !target.closest('.relative')) {
    isLanguageDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

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
      { label: copy.value.admin.sidebar.nav.quickCollect, to: '/admin/collect', icon: PlusCircle, badge: 'TERMINAL' },
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
      { label: 'Branches', to: '/admin/branches', icon: Building2 },
      { label: copy.value.admin.sidebar.nav.users, to: '/admin/users', icon: UserCheck },
      { label: copy.value.admin.sidebar.nav.organization, to: '/admin/organization', icon: Building2 },
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Ensure the logo section allows overflow for the switcher dropdown */
.LogoSection {
  position: relative;
  z-index: 60;
}
</style>
