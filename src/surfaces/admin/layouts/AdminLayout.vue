<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar / Nav -->
    <nav class="fixed inset-y-0 left-0 w-64 bg-white shadow-sm ring-1 ring-gray-900/5">
      <div class="flex h-16 items-center px-6 border-b border-gray-100">
        <span class="text-xl font-bold tracking-tight text-indigo-600">MFTL Collections</span>
      </div>
      <div class="p-4">
        <!-- Tenant Switcher Placeholder -->
        <div class="mb-6 rounded-lg bg-gray-50 p-3">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tenant
          </p>
          <p class="text-sm font-medium text-gray-900">
            {{ tenantStore.currentTenantName || 'Select Tenant' }}
          </p>
        </div>
        
        <ul class="space-y-1">
          <li
            v-for="item in navItems"
            :key="item.name"
          >
            <router-link
              :to="item.to"
              class="flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
              active-class="bg-indigo-50 text-indigo-600"
            >
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pl-64">
      <header class="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
        <div class="flex items-center gap-x-4">
          <h1 class="text-lg font-semibold text-gray-900">
            Admin Dashboard
          </h1>
        </div>
        <div class="flex items-center gap-x-4">
          <span class="text-sm text-gray-500">{{ user?.email }}</span>
          <button
            class="text-sm font-medium text-gray-700 hover:text-indigo-600"
            @click="() => logout()"
          >
            Logout
          </button>
        </div>
      </header>
      
      <div class="p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useTenantStore } from '../../../core/stores/tenantStore'

const { user, logout } = useAuth0()
const tenantStore = useTenantStore()

const navItems = [
  { name: 'Dashboard', to: '/admin' },
  { name: 'Events', to: '/admin/events' },
  { name: 'Recipient Funds', to: '/admin/recipient-funds' },
  { name: 'Reports', to: '/admin/reports' },
]
</script>
