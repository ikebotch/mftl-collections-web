<template>
  <div class="space-y-10 pb-20">
    <!-- Header -->
    <header class="flex flex-col gap-2">
      <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
        System Menu
      </p>
      <h2 class="text-3xl lg:text-5xl font-black tracking-tight uppercase italic text-slate-900">
        Terminal Ops
      </h2>
    </header>

    <!-- Menu Grid -->
    <nav class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <button
        v-for="(item, index) in menuItems"
        :key="index"
        class="group p-8 text-left border border-slate-200 bg-white hover:border-violet-500 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
        @click="item.action ? item.action() : $router.push(item.to)"
      >
        <div class="relative z-10">
          <component 
            :is="item.icon" 
            class="w-8 h-8 transition-colors duration-300"
            :class="item.highlight ? 'text-violet-600' : 'text-slate-400 group-hover:text-violet-500'"
          />
          <h3 class="mt-8 text-xl font-black uppercase italic text-slate-900">
            {{ item.label }}
          </h3>
          <p class="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
            {{ item.description }}
          </p>
        </div>
        
        <!-- Decorative subtle background icon -->
        <component 
          :is="item.icon" 
          class="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
        />
      </button>
    </nav>

    <!-- Footer Action -->
    <div class="pt-10 border-t border-slate-200">
      <button 
        class="flex items-center gap-4 text-rose-500 hover:text-rose-600 transition-colors group"
        @click="handleLogout"
      >
        <div class="w-12 h-12 flex items-center justify-center border border-rose-100 bg-rose-50 group-hover:bg-rose-500 group-hover:text-white transition-all">
          <LogOut class="w-5 h-5" />
        </div>
        <div class="text-left">
          <p class="text-[10px] font-black uppercase tracking-widest">Session End</p>
          <p class="text-sm font-black uppercase">Terminate Session</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Settings, 
  RefreshCcw, 
  FileCheck, 
  HelpCircle, 
  LogOut,
  ShieldCheck,
  User
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const menuItems = [
  {
    label: 'EOD Settlement',
    description: 'Finalize today\'s collections and reconcile terminal balances.',
    to: '/collector/settlements',
    icon: FileCheck,
    highlight: true
  },
  {
    label: 'Sync Status',
    description: 'Check connectivity and synchronize pending offline transactions.',
    to: '/collector/sync',
    icon: RefreshCcw
  },
  {
    label: 'Profile Settings',
    description: 'Manage your collector profile and terminal preferences.',
    to: '/collector/settings',
    icon: User
  },
  {
    label: 'Security & PIN',
    description: 'Update your 4-digit authorization PIN and security settings.',
    to: '/collector/security',
    icon: ShieldCheck
  },
  {
    label: 'Help & Support',
    description: 'Access terminal manuals or contact system supervisors.',
    to: '/collector/support',
    icon: HelpCircle
  }
]

function handleLogout() {
  // Add logout logic
  console.log('Logging out...')
}
</script>
