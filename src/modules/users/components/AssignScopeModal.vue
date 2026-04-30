<template>
  <AppModal
    :open="open"
    title="Manage User Access"
    class="!max-w-2xl"
    @close="$emit('close')"
  >
    <div class="space-y-8">
      <!-- Reusing Global Tabs -->
      <DetailTabs
        v-model="activeTab"
        :tabs="assignmentTabs"
      />

      <!-- Step 1: Select Scope & Target -->
      <div class="space-y-8 min-h-[250px]">
        <div
          v-if="activeTab === 'system'"
          class="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500"
        >
          <div class="p-6 bg-slate-50 border border-slate-100 rounded-none flex items-center gap-4">
            <div class="w-12 h-12 rounded-none bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-100">
              <Globe class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                System Wide Access
              </h4>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">
                Full platform capabilities across all tenants.
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="activeTab === 'org'"
          class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500"
        >
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Organization</label>
              <select 
                v-model="form.tenantId"
                class="w-full p-4 rounded-none bg-slate-50 border-slate-100 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
              >
                <option value="">
                  Current Organization
                </option>
                <option
                  v-for="t in tenants"
                  :key="t.id"
                  :value="t.id"
                >
                  {{ t.name }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Branch (Optional)</label>
              <select 
                v-model="form.branchId"
                class="w-full p-4 rounded-none bg-slate-50 border-slate-100 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
              >
                <option value="">
                  Full Organization
                </option>
                <option
                  v-for="b in branches"
                  :key="b.id"
                  :value="b.id"
                >
                  {{ b.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div
          v-if="activeTab === 'events'"
          class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500"
        >
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Event</label>
              <select 
                v-model="form.eventId"
                class="w-full p-4 rounded-none bg-slate-50 border-slate-100 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
              >
                <option value="">
                  Choose an event...
                </option>
                <option
                  v-for="e in events"
                  :key="e.id"
                  :value="e.id"
                >
                  {{ e.title }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Fund (Optional)</label>
              <select 
                v-model="form.fundId"
                :disabled="!form.eventId"
                class="w-full p-4 rounded-none bg-slate-50 border-slate-100 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all disabled:opacity-50"
              >
                <option value="">
                  All Event Funds
                </option>
                <option
                  v-for="f in filteredFunds"
                  :key="f.id"
                  :value="f.id"
                >
                  {{ f.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step 2: Role Selection -->
        <div class="space-y-4 pt-4 border-t border-slate-50">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Assign Functional Roles</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="role in availableRoles"
              :key="role"
              type="button"
              class="p-4 rounded-none border text-left transition-all"
              :class="form.roles.includes(role) 
                ? 'border-violet-600 bg-violet-50 ring-1 ring-violet-600' 
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'"
              @click="toggleRole(role)"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-[10px] font-black uppercase tracking-widest block"
                  :class="form.roles.includes(role) ? 'text-violet-600' : 'text-slate-900'"
                >{{ role }}</span>
                <Check
                  v-if="form.roles.includes(role)"
                  class="w-3 h-3 text-violet-600"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <AppButton
        variant="ghost"
        @click="$emit('close')"
      >
        Cancel
      </AppButton>
      <AppButton 
        variant="primary" 
        :loading="loading"
        :disabled="!isFormValid"
        @click="handleSubmit"
      >
        Assign Scopes
      </AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppModal from '@/shared/components/modals/AppModal.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import { useQuery } from '@tanstack/vue-query'
import { eventsService } from '@/modules/events/services/eventsService'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { tenantsService } from '@/modules/tenants/services/tenantsService'
import { branchesService } from '@/modules/tenants/services/branchesService'
import { useUsersStore } from '@/modules/users/store/usersStore'
import { Check, Globe } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  loading?: boolean
}>()

const emit = defineEmits(['close', 'assign'])

const activeTab = ref('org')
const usersStore = useUsersStore()

const assignmentTabs = computed(() => {
  const tabs = [
    { key: 'org', label: 'Org & Branches', icon: 'Building2' },
    { key: 'events', label: 'Events & Funds', icon: 'Calendar' }
  ]
  
  if (usersStore.isPlatformAdmin) {
    tabs.unshift({ key: 'system', label: 'System Access', icon: 'Globe' })
  }
  
  return tabs
})

const availableRoles = computed(() => {
  const allRoles = ['Platform Admin', 'Tenant Admin', 'Finance Admin', 'Event Manager', 'Collector', 'Viewer']
  
  if (!usersStore.isPlatformAdmin) {
    return allRoles.filter(r => r !== 'Platform Admin')
  }
  
  return allRoles
})

const form = ref({
  roles: [] as string[],
  tenantId: '',
  branchId: '',
  eventId: '',
  fundId: ''
})

function toggleRole(role: string) {
  const index = form.value.roles.indexOf(role)
  if (index === -1) form.value.roles.push(role)
  else form.value.roles.splice(index, 1)
}

const { data: tenants } = useQuery({
  queryKey: ['tenants-list'],
  queryFn: () => tenantsService.list(),
  enabled: computed(() => props.open)
})

const { data: branches } = useQuery({
  queryKey: ['branches-list', computed(() => form.value.tenantId)],
  queryFn: () => branchesService.list(form.value.tenantId),
  enabled: computed(() => props.open && activeTab.value === 'org')
})

const { data: events } = useQuery({
  queryKey: ['events-minimal'],
  queryFn: () => eventsService.list(),
  enabled: computed(() => props.open && activeTab.value === 'events')
})

const { data: funds } = useQuery({
  queryKey: ['funds-minimal'],
  queryFn: () => recipientFundsService.list(),
  enabled: computed(() => props.open && activeTab.value === 'events')
})

const filteredFunds = computed(() => {
  if (!form.value.eventId) return []
  return funds.value?.filter((f: any) => f.eventId === form.value.eventId) || []
})

const isFormValid = computed(() => {
  if (form.value.roles.length === 0) return false
  if (activeTab.value === 'events' && !form.value.eventId) return false
  return true
})

function handleSubmit() {
  let scopeType = 'Platform'
  let targetId = null

  if (activeTab.value === 'system') {
    scopeType = 'Platform'
  } else if (activeTab.value === 'org') {
    if (form.value.branchId) {
      scopeType = 'Branch'
      targetId = form.value.branchId
    } else {
      scopeType = 'Tenant'
      targetId = form.value.tenantId
    }
  } else if (activeTab.value === 'events') {
    if (form.value.fundId) {
      scopeType = 'RecipientFund'
      targetId = form.value.fundId
    } else {
      scopeType = 'Event'
      targetId = form.value.eventId
    }
  }

  emit('assign', { 
    roles: form.value.roles,
    scopeType,
    targetId: targetId || null
  })
}

watch(activeTab, () => {
  form.value = {
    roles: [],
    tenantId: '',
    branchId: '',
    eventId: '',
    fundId: ''
  }
})
</script>
