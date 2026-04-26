<template>
  <div class="space-y-10">
    <AdminPageHeader
      :title="copy.admin.pages.users.title"
      :description="copy.admin.pages.users.description"
    >
      <template #actions>
        <AppButton
          variant="primary"
          class="!rounded-xl shadow-premium"
        >
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
        placeholder="Search by name or email..."
        :show-clear="searchQuery || activeFilters.roles.length > 0 || activeFilters.status.length > 0"
        @clear="clearAllFilters"
      >
        <template #sections>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">System Roles</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="role in ['Admin', 'Collector', 'Supervisor']" 
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
                v-for="st in ['Active', 'Inactive']"
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
          <StatusBadge
            :status="value"
            :tone="value === 'Active' ? 'success' : 'neutral'"
          />
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

        <template #rowActions="{ row }">
          <RowActions
            :actions="[
              { label: 'Edit Permissions', icon: 'Settings', onClick: () => router.push(`/admin/users/${row.id}`) },
              { label: 'Revoke Access', icon: 'ShieldAlert', onClick: () => {} }
            ]"
          />
        </template>
      </DataTable>
    </div>

    <!-- Edit User Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Edit User Permissions"
      :subtitle="selectedUser?.id"
      @close="closeDrawer"
    >
      <div v-if="selectedUser" class="space-y-8">
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
            <input 
              v-model="editForm.name"
              type="text" 
              class="w-full p-4 rounded-xl border border-slate-200 focus:border-violet-500 outline-none transition-all font-bold"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
            <input 
              v-model="editForm.phoneNumber"
              type="text" 
              class="w-full p-4 rounded-xl border border-slate-200 focus:border-violet-500 outline-none transition-all font-bold"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
            <div class="flex gap-4">
              <label class="flex-1 flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                <input type="radio" v-model="editForm.isActive" :value="true" class="w-4 h-4 text-violet-600 focus:ring-violet-500" />
                <span class="text-xs font-black uppercase tracking-widest text-slate-900">Active</span>
              </label>
              <label class="flex-1 flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                <input type="radio" v-model="editForm.isActive" :value="false" class="w-4 h-4 text-violet-600 focus:ring-violet-500" />
                <span class="text-xs font-black uppercase tracking-widest text-slate-900">Inactive</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <template #actions>
        <AppButton
          variant="primary"
          class="flex-1 !rounded-xl shadow-premium"
          :loading="updateMutation.isPending.value"
          @click="handleUpdate"
        >
          Save Changes
        </AppButton>
        <AppButton
          variant="ghost"
          class="!rounded-xl"
          @click="closeDrawer"
        >
          Cancel
        </AppButton>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCopy } from '@/core/i18n/useCopy'
import { useUsers, useUpdateUser } from '../composables/useUsers'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import { UserPlus } from 'lucide-vue-next'
import type { UserRow } from '../services/usersService'
import { useToastStore } from '@/shared/stores/useToastStore'

const { copy } = useCopy()
const router = useRouter()
const query = useUsers()
const updateMutation = useUpdateUser()
const toast = useToastStore()
const searchQuery = ref('')
const activeFilters = ref({
  roles: [] as string[],
  status: [] as string[]
})

const isDrawerOpen = ref(false)
const selectedUser = ref<UserRow | null>(null)
const editForm = ref({
  name: '',
  phoneNumber: '',
  isActive: true
})

const columns = [
  { key: 'user', label: 'Identity' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'inviteState', label: 'Invite' },
  { key: 'scope', label: 'Assigned Scope' }
]

const filteredUsers = computed(() => {
  let items = query.data.value ?? []
  
  // 1. Text Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(i => 
      i.name?.toLowerCase().includes(q) || 
      i.email?.toLowerCase().includes(q)
    )
  }

  // 2. Role Filter (Multi-select)
  if (activeFilters.value.roles.length > 0) {
    items = items.filter(i => activeFilters.value.roles.some(r => i.role.includes(r)))
  }

  // 3. Status Filter (Multi-select)
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
  return query.data.value?.filter(u => u.inviteState === state).length.toString() || '0'
}

function openEditDrawer(user: UserRow) {
  selectedUser.value = user
  editForm.value = {
    name: user.name,
    phoneNumber: user.phoneNumber || '',
    isActive: user.status === 'Active'
  }
  isDrawerOpen.value = true
}

function closeDrawer() {
  isDrawerOpen.value = false
}

async function handleUpdate() {
  if (!selectedUser.value) return
  
  try {
    await updateMutation.mutateAsync({
      id: selectedUser.value.id,
      payload: editForm.value
    })
    toast.success('User permissions updated successfully')
    closeDrawer()
  } catch (err) {
    toast.error('Failed to update user permissions')
  }
}
</script>
