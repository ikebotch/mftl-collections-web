<template>
  <div class="space-y-10">
    <AdminPageHeader
      :title="copy.admin.pages.users.title"
      :description="copy.admin.pages.users.description"
    >
      <template #actions>
        <AppButton
          variant="primary"
          class="!rounded-none shadow-premium"
          @click="isInviteModalOpen = true"
        >
          <UserPlus class="w-4 h-4 mr-2" /> Invite System User
        </AppButton>
      </template>
    </AdminPageHeader>

    <div
      v-if="dashboardQuery.data.value && !dashboardQuery.data.value.isAuth0Configured"
      class="p-4 bg-amber-50 border-l-4 border-amber-500 flex items-start gap-3"
    >
      <ShieldAlert class="w-5 h-5 text-amber-600 mt-0.5" />
      <div>
        <p class="text-xs font-black uppercase tracking-widest text-amber-900">
          Auth0 Automation Not Configured
        </p>
        <p class="text-[10px] font-bold text-amber-700 uppercase mt-1">
          Automatic invitation links are disabled, but users can still be linked on first login.
        </p>
      </div>
    </div>

    <div
      v-if="dashboardQuery.data.value && !dashboardQuery.data.value.isAuth0WebhookConfigured"
      class="p-4 bg-slate-50 border-l-4 border-slate-400 flex items-start gap-3"
    >
      <Info class="w-5 h-5 text-slate-500 mt-0.5" />
      <div>
        <p class="text-xs font-black uppercase tracking-widest text-slate-900">
          Push Sync Disabled
        </p>
        <p class="text-[10px] font-bold text-slate-600 uppercase mt-1">
          Users created directly in Auth0 will appear after their first login. Enable the optional Auth0 webhook if you want users to appear before login.
        </p>
      </div>
    </div>

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
        placeholder="Search by name or email..."
        :show-clear="!!searchQuery || activeFilters.roles.length > 0 || activeFilters.status.length > 0"
        @clear="clearAllFilters"
      >
        <template #sections>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">System Roles</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="role in ['Admin', 'Collector', 'Supervisor', 'Finance']" 
                :key="role"
                class="px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all"
                :class="activeFilters.roles.includes(role) ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'"
                @click="toggleFilter('roles', role)"
              >
                {{ role }}
              </button>
            </div>
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Status</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="st in ['Active', 'Inactive', 'Suspended']"
                :key="st"
                class="px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all"
                :class="activeFilters.status.includes(st) ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'"
                @click="toggleFilter('status', st)"
              >
                {{ st }}
              </button>
            </div>
          </div>
        </template>
      </AdminFilterBar>

      <DataTable
        :columns="columns"
        :rows="filteredUsers"
        :loading="query.isLoading.value"
        exportable
        title="System Access Control"
      >
        <template #cell:user="{ row }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-none bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 uppercase">
              {{ row.name?.charAt(0) || 'U' }}
            </div>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <button 
                  class="font-black text-slate-900 tracking-tight hover:text-violet-600 transition-colors text-left"
                  @click="router.push(`/admin/users/${row.id}`)"
                >
                  {{ row.name }}
                </button>
                <span 
                  v-if="row.isPlatformAdmin" 
                  class="px-1.5 py-0.5 rounded-none bg-violet-600 text-[8px] font-black text-white uppercase tracking-widest"
                >Platform</span>
              </div>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ row.email }}</span>
            </div>
          </div>
        </template>

        <template #cell:role="{ value }">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">{{ value }}</span>
        </template>

        <template #cell:status="{ value }">
          <StatusBadge
            :status="value"
            :tone="value === 'Active' ? 'success' : (value === 'Suspended' ? 'danger' : 'neutral')"
          />
        </template>

        <template #cell:inviteStatus="{ value }">
          <div class="flex items-center gap-2">
            <div 
              class="w-1.5 h-1.5 rounded-none" 
              :class="value === 'Accepted' ? 'bg-emerald-500' : (value === 'Pending' ? 'bg-amber-500' : 'bg-slate-300')"
            />
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">
              {{ value === 'Pending' ? 'Invited (Awaiting Login)' : (value === 'Accepted' ? 'Linked to Auth0' : value) }}
            </span>
          </div>
        </template>

        <template #cell:scope="{ value }">
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 italic">{{ value }}</span>
        </template>

        <template #cell:lastLoginAt="{ value }">
          <span class="text-[10px] font-bold text-slate-500 tabular-nums">
            {{ value ? new Date(value).toLocaleString() : 'Never' }}
          </span>
        </template>

        <template #rowActions="{ row }">
          <RowActions
            :actions="[
              { label: 'Manage Identity', icon: 'Fingerprint', onClick: () => router.push(`/admin/users/${row.id}`) },
              { label: 'Suspend User', icon: 'ShieldAlert', onClick: () => handleStatusAction(row.id, 'Suspend') }
            ]"
          />
        </template>
      </DataTable>
    </div>

    <InviteUserModal 
      :is-open="isInviteModalOpen" 
      :loading="isInviting"
      @close="isInviteModalOpen = false"
      @invite="handleInvite"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCopy } from '@/core/i18n/useCopy'
import { useUsers } from '../composables/useUsers'
import { useQuery } from '@tanstack/vue-query'
import { getDashboardSummary } from '@/modules/dashboard/services/dashboardService'
import { usersService } from '../services/usersService'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import InviteUserModal from '../components/InviteUserModal.vue'
import { 
  UserPlus, 
  ShieldAlert, 
  Info 
} from 'lucide-vue-next'
import { useToastStore } from '@/shared/stores/useToastStore'

const { copy } = useCopy()
const router = useRouter()
const query = useUsers()
const dashboardQuery = useQuery({
  queryKey: ['admin-dashboard-summary'],
  queryFn: () => getDashboardSummary()
})
const toast = useToastStore()
const searchQuery = ref('')
const activeFilters = ref({
  roles: [] as string[],
  status: [] as string[]
})

const isInviteModalOpen = ref(false)
const isInviting = ref(false)

const columns = [
  { key: 'user', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'inviteStatus', label: 'Invite State' },
  { key: 'scope', label: 'Scope' },
  { key: 'lastLoginAt', label: 'Last Login' }
]

const filteredUsers = computed(() => {
  let items = query.data.value ?? []
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(i => 
      i.name?.toLowerCase().includes(q) || 
      i.email?.toLowerCase().includes(q)
    )
  }

  if (activeFilters.value.roles.length > 0) {
    items = items.filter(i => activeFilters.value.roles.some(r => i.role.includes(r)))
  }

  if (activeFilters.value.status.length > 0) {
    items = items.filter(i => activeFilters.value.status.includes(i.status))
  }

  return items
})

function toggleFilter(type: 'roles' | 'status', value: string) {
  const index = activeFilters.value[type].indexOf(value)
  if (index > -1) {
    activeFilters.value[type].splice(index, 1)
  } else {
    activeFilters.value[type].push(value)
  }
}

function clearAllFilters() {
  searchQuery.value = ''
  activeFilters.value.roles = []
  activeFilters.value.status = []
}

function countRole(role: string) {
  return query.data.value?.filter(u => u.role.includes(role)).length.toString() || '0'
}

function countInviteState(state: string) {
  return query.data.value?.filter(u => u.inviteStatus === state).length.toString() || '0'
}

async function handleInvite(payload: any) {
  isInviting.value = true
  try {
    await usersService.invite(payload)
    toast.success(`Invitation sent to ${payload.email}`)
    isInviteModalOpen.value = false
    query.refetch()
  } catch (err: any) {
    toast.error(err.message || 'Failed to send invitation')
  } finally {
    isInviting.value = false
  }
}

async function handleStatusAction(id: string, action: string) {
  try {
    await usersService.updateStatus(id, action)
    toast.success(`User ${action.toLowerCase()}d`)
    query.refetch()
  } catch {
    toast.error('Failed to update user status')
  }
}
</script>
