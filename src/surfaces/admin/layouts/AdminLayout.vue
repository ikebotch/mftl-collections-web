<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
    <AppToast />
    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 z-50 bg-[#060b13] text-white transition-all duration-500 ease-in-out transform lg:translate-x-0 -translate-x-full border-r border-navy-900 flex flex-col"
      :class="[isSidebarCollapsed ? 'w-20' : 'w-72']"
    >
      <!-- Logo & Switcher Section -->
      <div 
        class="LogoSection overflow-hidden transition-all duration-500 flex flex-col shrink-0"
        :class="[isSidebarCollapsed ? 'px-4 py-8 items-center' : 'px-8 py-10']"
      >
        <div class="flex items-center gap-4 mb-10">
          <div class="w-10 h-10 bg-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/20">
            <ShieldCheck class="w-6 h-6 text-white" />
          </div>
          <div v-if="!isSidebarCollapsed" class="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 class="text-[15px] font-black tracking-[0.15em] uppercase leading-none">{{ appName }}</h1>
            <p class="text-[9px] text-slate-500 mt-1.5 font-bold uppercase tracking-widest leading-none opacity-60">Intelligence Hub</p>
          </div>
        </div>
        
        <div 
          v-if="!isSidebarCollapsed" 
          class="animate-in fade-in slide-in-from-top-4 duration-700 bg-white/5 p-1 border border-white/5"
        >
          <TenantSwitcher />
        </div>
        <div v-else class="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/5">
          <Building2 class="w-5 h-5 text-slate-500" />
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-12 mt-4 overflow-y-auto custom-scrollbar overflow-x-hidden pt-2">
        <div
          v-for="(group, index) in navGroups"
          :key="index"
          class="space-y-4"
        >
          <h3
            v-if="group.title && !isSidebarCollapsed"
            class="px-4 text-[10px] uppercase tracking-[0.3em] text-slate-600 font-black mb-6 animate-in fade-in duration-700"
          >
            {{ group.title }}
          </h3>
          <div v-else-if="isSidebarCollapsed" class="h-px bg-white/5 mx-2 my-8" />

          <div class="space-y-1.5">
            <router-link
              v-for="item in group.items"
              :key="item.to"
              :to="item.to"
              class="group relative flex items-center px-4 py-3.5 rounded-none text-sm font-semibold transition-all duration-300 hover:bg-white/5"
              :class="[isSidebarCollapsed ? 'justify-center' : 'justify-between']"
              active-class="!bg-violet-600/10 text-white active-nav-item"
            >
              <div class="flex items-center gap-4">
                <component
                  :is="item.icon"
                  class="w-4.5 h-4.5 transition-colors duration-300 shrink-0"
                  :class="[$route.path === item.to ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300']"
                />
                <span 
                  v-if="!isSidebarCollapsed"
                  class="tracking-tight transition-all duration-500 whitespace-nowrap animate-in fade-in slide-in-from-left-4"
                  :class="[$route.path === item.to ? 'text-white' : 'text-slate-400 group-hover:text-slate-300']"
                >{{ item.label }}</span>
              </div>
              
              <div 
                v-if="item.badge && !isSidebarCollapsed" 
                class="px-2 py-0.5 rounded-none bg-violet-600 text-white text-[8px] font-black uppercase tracking-widest animate-in zoom-in duration-500 shadow-sm"
              >
                {{ item.badge }}
              </div>

              <!-- Active Indicator Bar -->
              <div 
                v-if="$route.path === item.to"
                class="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 animate-in slide-in-from-left-full duration-300"
              />
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div 
        class="p-8 border-t border-white/5 bg-black/40 mt-auto"
        :class="[isSidebarCollapsed ? 'px-4 flex flex-col items-center gap-6' : 'px-8']"
      >
        <div v-if="!isSidebarCollapsed" class="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic opacity-60">System Core Status</p>
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-900/40 animate-pulse" />
            <span class="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Operational v2.4</span>
          </div>
        </div>

        <div class="flex items-center" :class="[isSidebarCollapsed ? 'flex-col gap-6' : 'justify-between']">
          <div class="flex gap-6">
            <a href="#" class="text-slate-600 hover:text-violet-400 transition-colors group">
              <Search class="w-4.5 h-4.5" />
            </a>
            <a href="#" class="text-slate-600 hover:text-violet-400 transition-colors">
              <BarChart3 class="w-4.5 h-4.5" />
            </a>
          </div>
          <button 
            class="text-slate-600 hover:text-white transition-all duration-300 transform active:scale-95"
            @click="isSidebarCollapsed = !isSidebarCollapsed"
          >
            <ChevronLeft 
              class="w-5 h-5 transition-transform duration-500"
              :class="{ 'rotate-180': isSidebarCollapsed }"
            />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div 
      class="min-h-screen flex flex-col transition-all duration-500 ease-in-out"
      :class="[isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72']"
    >
      <!-- Topbar -->
      <header class="h-20 bg-white/95 backdrop-blur-2xl border-b border-slate-200 sticky top-0 z-[40] px-12 flex items-center justify-between">
        <!-- Search bar -->
        <div class="flex-1 max-w-xl relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Global search..." 
            class="w-full bg-slate-50 border border-slate-200 rounded-none py-3 pl-12 pr-4 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500 transition-all outline-none"
          >
        </div>

        <div class="flex items-center gap-10">
          <div class="flex items-center gap-4">
            <!-- Minimalist Language Dropdown -->
            <div class="relative">
              <button 
                class="flex items-center gap-2 px-4 py-2 rounded-none bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all duration-300 group"
                @click="isLanguageDropdownOpen = !isLanguageDropdownOpen"
              >
                <Globe class="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
                <span class="text-[11px] font-black text-slate-900 uppercase tracking-widest">{{ currentLocale }}</span>
                <ChevronDown 
                  class="w-3.5 h-3.5 text-slate-400 transition-transform duration-300"
                  :class="{ 'rotate-180': isLanguageDropdownOpen }"
                />
              </button>

              <div 
                v-if="isLanguageDropdownOpen"
                class="absolute top-full left-0 mt-2 w-36 bg-white border border-slate-200 shadow-2xl z-[70] p-1.5 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <button 
                  v-for="loc in availableLocales" 
                  :key="loc"
                  class="w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 hover:bg-slate-50"
                  :class="currentLocale === loc ? 'text-violet-600 bg-violet-50' : 'text-slate-500'"
                  @click="setLocale(loc); isLanguageDropdownOpen = false"
                >
                  {{ loc }}
                </button>
              </div>
            </div>

            <button class="relative p-3 rounded-none text-slate-500 hover:bg-slate-50 hover:text-violet-600 transition-all duration-300">
              <Bell class="w-5 h-5" />
              <span class="absolute top-2.5 right-2.5 w-4.5 h-4.5 bg-violet-600 text-[9px] font-black text-white flex items-center justify-center rounded-none border-2 border-white">9+</span>
            </button>
            <router-link
              to="/admin/settings"
              class="p-3 rounded-none text-slate-500 hover:bg-slate-50 hover:text-violet-600 transition-all duration-300"
            >
              <Settings class="w-5 h-5" />
            </router-link>
          </div>

          <div class="w-px h-10 bg-slate-200" />

          <!-- User Info with Dropdown Trigger -->
          <div class="relative">
            <button 
              class="flex items-center gap-4 p-1 rounded-none hover:bg-slate-50 transition-all duration-300 group"
              @click="isUserDropdownOpen = !isUserDropdownOpen"
            >
              <div class="w-10 h-10 rounded-none overflow-hidden border border-slate-200 shadow-sm relative p-0.5 bg-white">
                <img
                  v-if="currentUser.picture"
                  :src="currentUser.picture"
                  class="w-full h-full object-cover"
                >
                <div
                  v-else
                  class="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-base rounded-none"
                >
                  {{ currentUser.name?.charAt(0) || 'A' }}
                </div>
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{{ formattedUserName }}</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Administrator</p>
              </div>
              <ChevronDown 
                class="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-transform duration-300 ml-2"
                :class="{ 'rotate-180': isUserDropdownOpen }"
              />
            </button>

            <!-- Premium User Dropdown -->
            <div 
              v-if="isUserDropdownOpen"
              class="absolute top-full right-0 mt-4 w-80 bg-white border border-slate-200 shadow-2xl z-[70] animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div class="p-8 border-b border-slate-100 bg-slate-50/50">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Authenticated Profile</p>
                <p class="text-base font-black text-slate-900 truncate uppercase tracking-tight mb-1">{{ currentUser.name }}</p>
                <p class="text-[12px] font-medium text-slate-500 truncate italic">{{ currentUser.email }}</p>
              </div>
              
              <div class="p-3">
                <router-link
                  to="/admin/settings"
                  class="flex items-center gap-4 px-5 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-violet-600 transition-colors"
                  @click="isUserDropdownOpen = false"
                >
                  <User class="w-4.5 h-4.5" />
                  Security Settings
                </router-link>
                <router-link
                  to="/admin/users"
                  class="flex items-center gap-4 px-5 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-violet-600 transition-colors"
                  @click="isUserDropdownOpen = false"
                >
                  <ShieldCheck class="w-4.5 h-4.5" />
                  Access Management
                </router-link>
              </div>

              <div class="p-3 border-t border-slate-100">
                <button
                  class="w-full flex items-center gap-4 px-5 py-4 text-[11px] font-black text-rose-600 uppercase tracking-widest hover:bg-rose-50 transition-colors"
                  @click="handleLogout"
                >
                  <LogOut class="w-4.5 h-4.5" />
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Body -->
      <main class="flex-1 p-12 lg:p-16 max-w-[1800px] mx-auto w-full">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition duration-500 ease-out" 
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

      <!-- Loading Overlay -->
      <Transition name="fade">
        <div
          v-if="isInitializing"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-[#060b13] backdrop-blur-md"
        >
          <div class="text-center">
            <div class="mx-auto mb-8 h-20 w-20 animate-spin rounded-none border-4 border-white/5 border-t-violet-500" />
            <h1 class="text-3xl font-black text-white uppercase tracking-[0.3em] mb-4">MFTL CORE</h1>
            <p class="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">Synchronizing secure operational workspace...</p>
          </div>
        </div>
      </Transition>

      <!-- Global Footer -->
      <footer class="py-10 px-16 flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-t border-slate-100 bg-white/50">
        <div>&copy; 2026 {{ appName }} &bull; Strategic Intelligence Division</div>
        <div class="flex items-center gap-12">
          <a href="#" class="hover:text-violet-600 transition-colors">Core Infrastructure</a>
          <a href="#" class="hover:text-violet-600 transition-colors">Audit logs</a>
          <a href="#" class="hover:text-violet-600 transition-colors">Status</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useUsersStore } from '@/modules/users/store/usersStore'
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
  ChevronLeft,
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
const { currentUser: auth0User } = useCurrentUser()
const usersStore = useUsersStore()
const isUserDropdownOpen = ref(false)
const isLanguageDropdownOpen = ref(false)
const isInitializing = ref(true)
const isSidebarCollapsed = ref(false)

const currentUser = computed(() => {
  if (usersStore.me) {
    return {
      name: usersStore.me.name,
      email: usersStore.me.email,
      picture: auth0User.value.picture || (usersStore.me as any).picture,
    }
  }
  return auth0User.value
})

const formattedUserName = computed(() => {
  const name = currentUser.value.name
  if (!name) return 'User'
  const parts = name.split(' ')
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

onMounted(async () => {
  document.addEventListener('mousedown', handleClickOutside)
  try {
    console.log('AdminLayout: Initializing...')
    await usersStore.fetchMe()
    isInitializing.value = false
    console.log('AdminLayout: Initialization complete.')
  } catch (err: any) {
    console.error('AdminLayout: Initialization failed:', err)
    isInitializing.value = false
    
    // If we're unauthorized, we should clear the session and go to login
    if (err.statusCode === 401 || err.statusCode === 403) {
      handleLogout()
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const appName = appConfig.appName

const navGroups = computed(() => {
  const groups = [
    {
      title: copy.value.admin.sidebar.groups.general,
      items: [
        { label: copy.value.admin.sidebar.nav.overview, to: '/admin', icon: LayoutDashboard, permission: 'dashboard.view' },
        { 
          label: 'Collector Terminal', 
          to: '/collector', 
          icon: UserCheck, 
          permission: 'contributions.create',
          badge: 'FIELD'
        },
      ]
    },
    {
      title: copy.value.admin.sidebar.groups.management,
      items: [
        { label: copy.value.admin.sidebar.nav.events, to: '/admin/events', icon: Calendar, permission: 'events.view' },
      ]
    },
    {
      title: copy.value.admin.sidebar.groups.finance,
      items: [
        { label: copy.value.admin.sidebar.nav.quickCollect, to: '/admin/collect', icon: PlusCircle, badge: 'TERMINAL', permission: 'contributions.record_cash' },
        { label: copy.value.admin.sidebar.nav.contributions, to: '/admin/contributions', icon: CircleDollarSign, permission: 'contributions.view' },
        { label: copy.value.admin.sidebar.nav.selfDonations, to: '/admin/self-donations', icon: Heart, badge: 'NEW', permission: 'donations.view' },
        { label: copy.value.admin.sidebar.nav.payments, to: '/admin/payments', icon: Wallet, permission: 'payments.view' },
        { label: copy.value.admin.sidebar.nav.donors, to: '/admin/donors', icon: Users, permission: 'donors.view' },
      ]
    },
    {
      title: copy.value.admin.sidebar.groups.operations,
      items: [
        { label: copy.value.admin.sidebar.nav.collectors, to: '/admin/collectors', icon: UserCheck, badge: 'NEW', permission: 'collectors.view' },
        { label: copy.value.admin.sidebar.nav.reports, to: '/admin/reports', icon: BarChart3, permission: 'reports.view' },
      ]
    },
    {
      title: copy.value.admin.sidebar.groups.system,
      items: [
        { label: copy.value.admin.sidebar.nav.settlements, to: '/admin/settlements', icon: ShieldCheck, permission: 'settlements.view' },
        { label: 'Branches', to: '/admin/branches', icon: Building2, permission: 'branches.view' },
        { label: copy.value.admin.sidebar.nav.users, to: '/admin/users', icon: UserCheck, permission: 'users.view' },
        { label: copy.value.admin.sidebar.nav.organization, to: '/admin/organization', icon: Building2, permission: 'organisations.view' },
        { label: copy.value.admin.sidebar.nav.settings, to: '/admin/settings', icon: Settings, permission: 'settings.view' },
        { label: 'Notification Templates', to: '/admin/settings/notification-templates', icon: Bell, badge: 'NEW', permission: 'notification-templates.view' },
      ]
    },
  ]

  return groups
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.permission || usersStore.hasPermission(item.permission))
    }))
    .filter(group => group.items.length > 0)
})

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
