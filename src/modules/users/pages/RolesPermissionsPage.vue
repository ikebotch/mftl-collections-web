<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Roles & Permissions"
      description="Define system-wide access levels and fine-grained permission matrices."
    />

    <!-- Backend Pending Alert -->
    <section class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-start gap-6 relative overflow-hidden">
      <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
        <ShieldCheck class="w-6 h-6" />
      </div>
      <div class="space-y-2">
        <h2 class="text-lg font-black text-slate-900 tracking-tight uppercase italic">
          Permission Matrix Implementation Pending
        </h2>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Auth Service Bridge Not Active
        </p>
        <p class="text-slate-600 font-medium max-w-2xl text-xs leading-relaxed">
          The fine-grained permission system is currently being mapped to the backend identity provider. System roles are currently fixed and based on standard organizational tiers.
        </p>
      </div>
    </section>

    <div class="grid gap-8">
      <AppCard class="!p-0 overflow-hidden">
        <DataTable
          :columns="columns"
          :rows="roles"
        >
          <template #cell:role="{ row }">
            <div class="flex flex-col py-2">
              <span class="font-black text-slate-900 tracking-tight text-sm uppercase italic">{{ row.role }}</span>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{{ row.description }}</span>
            </div>
          </template>

          <template #cell:permissions="{ value }">
            <div class="flex flex-wrap gap-1.5 py-2">
              <span 
                v-for="perm in value" 
                :key="perm"
                class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200"
              >
                {{ perm }}
              </span>
            </div>
          </template>

          <template #rowActions>
            <RowActions
              :actions="[
                { label: 'View Details', icon: 'Eye', onClick: () => {} }
              ]"
            />
          </template>
        </DataTable>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import { ShieldCheck } from 'lucide-vue-next'

const columns = [
  { key: 'role', label: 'System Role', width: '30%' },
  { key: 'permissions', label: 'Assigned Permissions' }
]

const roles = [
  { 
    role: 'Platform Admin', 
    description: 'Full system-wide management access.',
    permissions: ['all_access', 'tenant_management', 'system_config', 'audit_logs']
  },
  { 
    role: 'Tenant Admin', 
    description: 'Full access within a single organization.',
    permissions: ['manage_events', 'manage_funds', 'manage_collectors', 'view_reports', 'manage_users']
  },
  { 
    role: 'Supervisor', 
    description: 'Field management and regional reporting.',
    permissions: ['view_events', 'reconcile_cash', 'view_collector_history']
  },
  { 
    role: 'Collector', 
    description: 'Field collection and receipting only.',
    permissions: ['record_contribution', 'issue_receipt', 'view_own_history']
  },
  { 
    role: 'Recipient Viewer', 
    description: 'Read-only access to specific funds.',
    permissions: ['view_assigned_fund_performance']
  }
]
</script>
