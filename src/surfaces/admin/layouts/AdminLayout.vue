<template>
  <div class="min-h-screen bg-slate-100">
    <div class="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_1fr]">
      <aside class="border-b border-slate-200 bg-slate-950 px-6 py-8 text-slate-100 lg:border-b-0 lg:border-r">
        <div class="flex items-center justify-between lg:block">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
              Admin surface
            </p>
            <h1 class="mt-3 text-2xl font-semibold">
              {{ appName }}
            </h1>
          </div>
        </div>
        <div class="mt-8">
          <TenantSwitcher />
        </div>
        <nav
          class="mt-8 space-y-2"
          aria-label="Admin navigation"
        >
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            active-class="bg-white text-slate-950"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </aside>

      <div class="min-w-0">
        <header class="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-sm text-slate-500">
                Tenant-aware operations through {{ tenantHeaderName }}
              </p>
              <p class="text-base font-medium text-slate-950">
                {{ tenantName }}
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-sm text-slate-500">{{ currentUser.email || 'Not signed in' }}</span>
              <AppButton
                variant="secondary"
                @click="handleLogout"
              >
                Sign out
              </AppButton>
            </div>
          </div>
        </header>
        <main class="space-y-8 px-6 py-8">
          <router-view />
        </main>
      </div>
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
import AppButton from '@/shared/components/buttons/AppButton.vue'

const auth0 = useAuth0()
const { currentUser } = useCurrentUser()
const tenantStore = useTenantStore()

const appName = appConfig.appName
const tenantHeaderName = appConfig.api.tenantHeaderName
const tenantName = computed(() => tenantStore.selectedTenantName || 'No tenant selected')

const navItems = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Events', to: '/admin/events' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Settings', to: '/admin/settings' },
  { label: 'Contributions', to: '/admin/contributions' },
  { label: 'Payments', to: '/admin/payments' },
  { label: 'Receipts', to: '/admin/receipts' },
  { label: 'Reports', to: '/admin/reports' },
  { label: 'Settlements', to: '/admin/settlements' },
  { label: 'Self donations', to: '/admin/self-donations' },
]

function handleLogout() {
  void auth0.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  })
}
</script>
