<template>
  <div class="min-h-screen bg-[#060B16] text-white selection:bg-violet-500/30">
    <!-- ══════════════════════════════════════════════════
         TERMINAL HEADER
    ══════════════════════════════════════════════════ -->
    <header class="px-6 pt-12 pb-10 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
      <div class="max-w-xl mx-auto space-y-2">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-1.5 bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.5)] animate-pulse" />
          <p class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">
            System Menu
          </p>
        </div>
        <h1 class="text-4xl font-black text-white uppercase tracking-tight italic leading-none">
          Terminal Ops
        </h1>
        <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Node Configuration & Protocol Settings
        </p>
      </div>
    </header>

    <main class="max-w-xl mx-auto px-6 py-10 pb-32">
      <!-- Menu Grid -->
      <nav class="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button
          v-for="(item, index) in menuItems"
          :key="index"
          class="
            group p-8 text-left border border-white/5 bg-white/[0.02] 
            hover:border-violet-500/50 hover:bg-white/[0.04] 
            transition-all duration-300 relative overflow-hidden
          "
          @click="$router.push(item.to)"
        >
          <div class="relative z-10 flex items-start justify-between gap-6">
            <div class="space-y-6 flex-1 min-w-0">
              <div 
                class="h-12 w-12 bg-white/5 flex items-center justify-center transition-all group-hover:bg-violet-600 group-hover:text-white"
                :class="item.highlight ? 'text-violet-400 border border-violet-500/20' : 'text-slate-500'"
              >
                <component
                  :is="item.icon"
                  class="w-6 h-6"
                />
              </div>
              <div>
                <h3 class="text-xl font-black uppercase italic text-white group-hover:text-violet-400 transition-colors">
                  {{ item.label }}
                </h3>
                <p class="mt-2 text-xs text-slate-500 font-bold uppercase tracking-wide leading-relaxed opacity-60">
                  {{ item.description }}
                </p>
              </div>
            </div>
            <ArrowRight class="w-5 h-5 text-slate-800 group-hover:text-violet-500 transition-colors mt-4" />
          </div>
          
          <!-- Decorative subtle background icon -->
          <component 
            :is="item.icon" 
            class="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-[0.01] group-hover:opacity-[0.03] transition-opacity pointer-events-none"
          />
        </button>
      </nav>

      <!-- Termination Action -->
      <div class="mt-12 pt-10 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <button 
          class="w-full flex items-center gap-6 text-rose-500 hover:text-rose-400 transition-colors group p-4 border border-rose-500/10 hover:bg-rose-500/5"
          @click="handleLogout"
        >
          <div class="w-14 h-14 flex items-center justify-center border border-rose-500/20 bg-rose-500/5 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-lg">
            <LogOut class="w-6 h-6" />
          </div>
          <div class="text-left">
            <p class="text-[10px] font-black uppercase tracking-[0.4em] mb-1">
              Terminal Shutdown
            </p>
            <p class="text-lg font-black uppercase tracking-tight">
              Terminate Session
            </p>
          </div>
        </button>
      </div>

      <!-- Version Indicator -->
      <div class="mt-16 text-center">
        <p class="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">
          MFTL Node Terminal v2.4.0 (Enterprise)
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { 
  RefreshCcw, 
  FileCheck, 
  HelpCircle, 
  LogOut,
  ShieldCheck,
  User,
  ArrowRight
} from 'lucide-vue-next'

const menuItems = [
  {
    label: 'EOD Settlement',
    description: 'Finalize today\'s collections and reconcile terminal balances with the master node.',
    to: '/collector/settlements',
    icon: FileCheck,
    highlight: true
  },
  {
    label: 'Sync Status',
    description: 'Check node connectivity and synchronize pending offline transactions to the hub.',
    to: '/collector/sync',
    icon: RefreshCcw
  },
  {
    label: 'Node Identity',
    description: 'Manage your collector profile and terminal authorization preferences.',
    to: '/collector/settings',
    icon: User
  },
  {
    label: 'Security & PIN',
    description: 'Update your 4-digit authorization protocol and secure node credentials.',
    to: '/collector/security',
    icon: ShieldCheck
  },
  {
    label: 'Node Support',
    description: 'Access terminal operational manuals or contact hub supervisors.',
    to: '/collector/support',
    icon: HelpCircle
  }
]

function handleLogout() {
  // Add logout logic
  console.log('Terminating session...')
}
</script>

<style scoped>
/* Specific terminal styles */
</style>
