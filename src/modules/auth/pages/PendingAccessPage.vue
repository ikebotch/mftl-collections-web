<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import { ShieldAlert, LogOut, MessageCircle } from 'lucide-vue-next'
import AppButton from '@/shared/components/buttons/AppButton.vue'

const { logout } = useAuth0()
const router = useRouter()

function handleLogout() {
  logout({ logoutParams: { returnTo: window.location.origin } })
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-50 font-sans">
    <div class="w-full max-w-lg relative">
      <!-- Decorative background element -->
      <div class="absolute -top-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
      
      <div class="relative rounded-none border border-white/10 bg-white/5 p-12 text-center shadow-2xl shadow-slate-950/40 backdrop-blur-sm overflow-hidden">
        <!-- Editorial accent line -->
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-violet-500 to-rose-500" />
        
        <div class="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-none bg-slate-900 border border-white/5 shadow-inner">
          <ShieldAlert class="h-10 w-10 text-teal-400" />
        </div>

        <h1 class="text-[32px] font-black tracking-tighter uppercase leading-none mb-4 italic">
          Access Authorization Pending
        </h1>
        
        <div class="h-px w-20 bg-teal-500/50 mx-auto mb-8" />

        <p class="text-[13px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed mb-12">
          Your account is active, but access has not been assigned yet. Please contact your administrator to authorize your profile within the system.
        </p>

        <div class="bg-white/5 border border-white/5 p-8 mb-12 text-left">
          <h2 class="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <MessageCircle class="w-3.5 h-3.5" /> Next Steps
          </h2>
          <p class="text-[11px] font-medium text-slate-300 leading-relaxed">
            Contact your Regional Administrator or System Manager to assign your role. Once assigned, you will be able to access your designated Tenant or Branch dashboards.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <AppButton
            variant="outline"
            class="flex-1 !rounded-none border-white/10 hover:bg-white/5 text-white py-6"
            @click="handleLogout"
          >
            <LogOut class="w-4 h-4 mr-2" /> Sign Out
          </AppButton>
          <AppButton
            variant="primary"
            class="flex-1 !rounded-none bg-teal-500 hover:bg-teal-400 text-slate-950 py-6 font-black uppercase tracking-widest"
            @click="router.replace('/admin')"
          >
            Retry Access
          </AppButton>
        </div>
      </div>
      
      <p class="mt-8 text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
        MFTL Collections &bull; Security Infrastructure
      </p>
    </div>
  </main>
</template>
