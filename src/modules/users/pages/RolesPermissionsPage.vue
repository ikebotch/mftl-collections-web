<template>
  <div class="space-y-10 pb-20">
    <AdminPageHeader
      title="Roles & Permissions"
      description="Define system-wide access levels and fine-grained permission matrices."
    />

    <!-- Auth0 Sync Status -->
    <section class="grid md:grid-cols-3 gap-8">
      <AppCard class="md:col-span-2 !p-10 bg-slate-900 text-white overflow-hidden relative">
        <div class="relative z-10 space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <ShieldCheck class="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 class="text-sm font-black uppercase tracking-widest italic">
                Auth0 Management Bridge
              </h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                State: Connected & Synchronized
              </p>
            </div>
          </div>
          <p class="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
            The system roles listed below are synchronized with Auth0 Role Collections. When a user is assigned a role in this dashboard, the corresponding permissions are automatically propagated to their Auth0 identity for secure API authentication.
          </p>
          <div class="flex gap-4">
            <AppButton
              variant="white"
              size="xs"
            >
              Reconcile Now
            </AppButton>
            <AppButton
              variant="ghost"
              size="xs"
              class="!text-slate-400"
            >
              View Auth0 Logs
            </AppButton>
          </div>
        </div>
        <Fingerprint class="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
      </AppCard>

      <AppCard class="!p-10 border-slate-200 shadow-sm flex flex-col justify-between">
        <div class="space-y-4">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
            Security Note
          </h3>
          <p class="text-[11px] text-slate-600 font-medium leading-relaxed">
            Fine-grained permissions (scopes) are enforced at the API level via JWT claim validation.
          </p>
        </div>
        <AppButton
          variant="outline"
          size="sm"
          class="w-full"
        >
          Security Documentation
        </AppButton>
      </AppCard>
    </section>

    <!-- Permission Matrix -->
    <div class="space-y-8">
      <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center italic">
        Active Permission Matrix
      </h3>
      
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="p-6 text-left bg-slate-50 border-b border-slate-100 min-w-[250px]">
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Feature / Module</span>
              </th>
              <th
                v-for="role in roles"
                :key="role.role"
                class="p-6 text-center bg-slate-50 border-b border-slate-100"
              >
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-900 block">{{ role.role }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="feature in features"
              :key="feature.name"
              class="group hover:bg-slate-50/50 transition-colors"
            >
              <td class="p-6 border-b border-slate-100">
                <div class="space-y-1">
                  <span class="text-[11px] font-black uppercase tracking-widest text-slate-900 italic block">{{ feature.name }}</span>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ feature.description }}</span>
                </div>
              </td>
              <td
                v-for="role in roles"
                :key="role.role"
                class="p-6 border-b border-slate-100 text-center"
              >
                <div
                  v-if="role.permissions.includes(feature.key) || role.permissions.includes('all_access')"
                  class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100"
                >
                  <Check class="w-3.5 h-3.5" />
                </div>
                <div
                  v-else
                  class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-50 text-slate-200 border border-slate-100"
                >
                  <Minus class="w-3.5 h-3.5" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { ShieldCheck, Fingerprint, Check, Minus } from 'lucide-vue-next'

const features = [
  { key: 'tenant_management', name: 'Tenant Control', description: 'Configure organization-wide settings' },
  { key: 'manage_users', name: 'User Onboarding', description: 'Invite and manage system accounts' },
  { key: 'manage_events', name: 'Event Operations', description: 'Create and monitor collection events' },
  { key: 'manage_funds', name: 'Fund Distribution', description: 'Manage recipient funds and targets' },
  { key: 'view_reports', name: 'Financial Reporting', description: 'Access dashboards and analytics' },
  { key: 'reconcile_cash', name: 'Cash Reconciliation', description: 'Verify and settle field collections' },
  { key: 'record_contribution', name: 'Field Receipting', description: 'Issue digital receipts to donors' }
]

const roles = [
  { 
    role: 'Platform Admin', 
    permissions: ['all_access']
  },
  { 
    role: 'Tenant Admin', 
    permissions: ['manage_events', 'manage_funds', 'manage_collectors', 'view_reports', 'manage_users', 'tenant_management']
  },
  { 
    role: 'Finance Admin', 
    permissions: ['view_reports', 'manage_funds', 'reconcile_cash']
  },
  { 
    role: 'Event Manager', 
    permissions: ['manage_events', 'view_reports', 'manage_collectors']
  },
  { 
    role: 'Collector', 
    permissions: ['record_contribution', 'view_own_history']
  }
]
</script>
