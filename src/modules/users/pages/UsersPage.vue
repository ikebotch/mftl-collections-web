<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Users"
      description="Manage system access for admins, supervisors, and field collectors."
    >
      <template #actions>
        <AppButton variant="primary" class="!rounded-xl shadow-premium">
          <UserPlus class="w-4 h-4 mr-2" /> Invite System User
        </AppButton>
      </template>
    </AdminPageHeader>

    <AdminMetricGrid>
      <MetricCard
        label="Total Users"
        :value="query.data.value?.length.toString() || '0'"
        icon="Users"
        color="slate"
      />
      <MetricCard
        label="Admins"
        :value="countRole('Admin')"
        icon="ShieldCheck"
        color="purple"
      />
      <MetricCard
        label="Collectors"
        :value="countRole('Collector')"
        icon="Zap"
        color="amber"
      />
      <MetricCard
        label="Pending Invites"
        :value="countInviteState('Pending')"
        icon="Mail"
        color="blue"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search by name, email or role..."
      />

      <DataTable
        :columns="columns"
        :rows="filteredUsers"
        :loading="query.isLoading.value"
      >
        <template #cell:user="{ row }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 uppercase">
              {{ row.name?.charAt(0) || 'U' }}
            </div>
            <div class="flex flex-col">
              <span class="font-black text-slate-900 tracking-tight">{{ row.name }}</span>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ row.email }}</span>
            </div>
          </div>
        </template>

        <template #cell:role="{ value }">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">{{ value }}</span>
        </template>

        <template #cell:status="{ value }">
          <StatusBadge :status="value" :tone="value === 'Active' ? 'success' : 'neutral'" />
        </template>

        <template #cell:inviteState="{ value }">
          <span 
            class="text-[10px] font-black uppercase tracking-widest"
            :class="value === 'Accepted' ? 'text-emerald-600' : 'text-amber-500'"
          >
            {{ value }}
          </span>
        </template>

        <template #cell:scope="{ value }">
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 italic">{{ value }}</span>
        </template>

        <template #rowActions>
          <RowActions
            :actions="[
              { label: 'Edit Permissions', icon: 'Settings', onClick: () => {} },
              { label: 'Revoke Access', icon: 'ShieldAlert', onClick: () => {} }
            ]"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUsers } from '../composables/useUsers'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { UserPlus } from 'lucide-vue-next'

const query = useUsers()
const searchQuery = ref('')

const columns = [
  { key: 'user', label: 'Identity' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'inviteState', label: 'Invite' },
  { key: 'scope', label: 'Assigned Scope' }
]

const filteredUsers = computed(() => {
  const items = query.data.value ?? []
  if (!searchQuery.value) return items
  const q = searchQuery.value.toLowerCase()
  return items.filter(i => 
    i.name?.toLowerCase().includes(q) || 
    i.email?.toLowerCase().includes(q) ||
    i.role?.toLowerCase().includes(q)
  )
})

function countRole(role: string) {
  return query.data.value?.filter(u => u.role.includes(role)).length.toString() || '0'
}

function countInviteState(state: string) {
  return query.data.value?.filter(u => u.inviteState === state).length.toString() || '0'
}
</script>
