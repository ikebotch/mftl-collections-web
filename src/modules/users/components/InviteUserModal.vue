<template>
  <AppModal
    :open="isOpen"
    title="Invite System User"
    subtitle="Grant access to the management platform"
    @close="$emit('close')"
  >
    <div class="space-y-6 py-4">
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
          <AppInput
            v-model="form.name"
            placeholder="e.g. John Doe"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
          <AppInput
            v-model="form.email"
            type="email"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div class="space-y-4">
        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">System Role</label>
        <div class="grid grid-cols-3 gap-3">
          <button 
            v-for="role in roles" 
            :key="role"
            class="p-4 border rounded-xl transition-all text-left group"
            :class="form.role === role ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-100 hover:border-slate-300'"
            @click="form.role = role"
          >
            <span 
              class="text-[10px] font-black uppercase tracking-widest block mb-1"
              :class="form.role === role ? 'text-white' : 'text-slate-900'"
            >
              {{ role.replace(/([A-Z])/g, ' $1').trim() }}
            </span>
            <span 
              class="text-[9px] font-bold block leading-tight"
              :class="form.role === role ? 'text-slate-400' : 'text-slate-400 group-hover:text-slate-500'"
            >
              {{ getRoleDescription(role) }}
            </span>
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Scope</label>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <AppSelect 
              v-model="form.scopeType" 
              :options="scopeOptions" 
              label="Scope Level"
            />
          </div>
          <div
            v-if="form.scopeType !== 'Platform'"
            class="space-y-2"
          >
            <AppInput
              v-model="form.targetId"
              label="Target ID (Optional)"
              placeholder="Specific UUID if applicable"
            />
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <AppButton
        variant="primary"
        class="flex-1 !rounded-xl shadow-premium"
        :loading="loading"
        :disabled="!isValid"
        @click="handleSubmit"
      >
        Send Invitation
      </AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppModal from '@/shared/components/modals/AppModal.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'

const props = defineProps<{
  isOpen: boolean
  loading?: boolean
}>()

const emit = defineEmits(['close', 'invite'])

const form = ref({
  name: '',
  email: '',
  role: 'Viewer',
  scopeType: 'Tenant',
  targetId: ''
})

const roles = ['PlatformAdmin', 'TenantAdmin', 'FinanceAdmin', 'EventManager', 'Collector', 'Viewer']

const scopeOptions = [
  { label: 'Platform Global', value: 'Platform' },
  { label: 'Tenant Wide', value: 'Tenant' },
  { label: 'Event Specific', value: 'Event' },
  { label: 'Fund Specific', value: 'RecipientFund' }
]

const isValid = computed(() => {
  return form.value.name && form.value.email && form.value.role
})

function getRoleDescription(role: string) {
  const desc: Record<string, string> = {
    PlatformAdmin: 'Full system control',
    TenantAdmin: 'Manage own organization',
    FinanceAdmin: 'Reports and settlements',
    EventManager: 'Manage specific events',
    Collector: 'On-ground collection',
    Viewer: 'Read-only access'
  }
  return desc[role] || ''
}

function handleSubmit() {
  const payload = { 
    ...form.value,
    targetId: form.value.targetId || null 
  }
  emit('invite', payload)
}
</script>
