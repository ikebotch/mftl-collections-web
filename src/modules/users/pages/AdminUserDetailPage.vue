<template>
  <div v-if="query.isLoading.value" class="py-32">
    <LoadingState text="Retrieving user profile..." />
  </div>
  <ErrorState
    v-else-if="query.isError.value"
    title="Data Retrieval Failed"
    :message="query.error.value?.message"
    show-retry
    @retry="query.refetch"
  />
  <div v-else-if="user" class="space-y-10 pb-20">
    <DetailPageHeader
      :title="user.name"
      description="System access control, role management, and audit logs."
      back-to="/admin/users"
      back-label="Access Control"
    >
      <template #status>
        <div class="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] shrink-0">
          <div 
            class="w-1.5 h-1.5 rounded-full"
            :class="user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
          />
          <span class="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">
            {{ user.status }}
          </span>
        </div>
      </template>
    </DetailPageHeader>

    <div class="space-y-12">
      <div class="sticky top-0 z-40 -mx-8 px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 mb-12">
        <div class="max-w-[1200px] mx-auto">
          <DetailTabs v-model="activeTab" :tabs="tabs" />
        </div>
      </div>

      <div class="min-h-[400px]">
        <div v-if="activeTab === 'overview'">
          <AdminWizardLayout :sections="sections" title="User Management">
            <!-- Identity Section -->
            <AppCard id="section-identity" class="!p-20 border-slate-200/50 shadow-sm">
              <div class="flex items-center justify-between mb-16">
                <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80">Step 01: Profile</h3>
                <button v-if="!isEditing" @click="isEditing = true" class="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-black uppercase tracking-widest text-[10px]">
                  <Pencil class="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              <div v-if="!isEditing" class="grid md:grid-cols-2 gap-20">
                <div class="space-y-4">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Full Name</p>
                  <p class="text-lg font-black text-slate-900 uppercase tracking-tight">{{ user.name }}</p>
                </div>
                <div class="space-y-4">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Email Address</p>
                  <p class="text-lg font-black text-slate-900 italic tracking-tight">{{ user.email }}</p>
                </div>
                <div class="space-y-4">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Phone Number</p>
                  <p class="text-lg font-black text-slate-900 tracking-tight">{{ user.phoneNumber || 'N/A' }}</p>
                </div>
                <div class="space-y-4">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Role</p>
                  <p class="text-lg font-black text-slate-900 uppercase tracking-tight">{{ user.role }}</p>
                </div>
              </div>

              <div v-else class="space-y-12">
                <div class="grid md:grid-cols-2 gap-12">
                  <AppInput v-model="form.name" label="Full Name" placeholder="Isaac Botchway" />
                  <AppInput v-model="form.phoneNumber" label="Phone Number" placeholder="+233..." />
                </div>
                <div class="grid md:grid-cols-2 gap-12">
                  <AppSelect 
                    v-model="form.status" 
                    label="Account Status"
                    :options="[{label:'Active', value:'Active'}, {label:'Inactive', value:'Inactive'}]"
                  />
                </div>
              </div>
            </AppCard>

            <!-- Audit Section -->
            <AppCard id="section-audit" class="!p-20 border-slate-200/50 shadow-sm mt-12">
              <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 mb-16">Step 02: Activity</h3>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest italic">User activity logs will appear here...</p>
            </AppCard>
          </AdminWizardLayout>
        </div>
      </div>
    </div>

    <StickyFormActions v-if="isEditing">
      <template #left>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Pending changes to profile identity</span>
      </template>
      <AppButton variant="outline" @click="isEditing = false">Discard</AppButton>
      <AppButton variant="primary" :loading="updateMutation.isPending.value" @click="handleSave">Save Profile</AppButton>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUser, useUpdateUser } from '../composables/useUsers'
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import { Pencil } from 'lucide-vue-next'
import { useToastStore } from '@/shared/stores/useToastStore'

const route = useRoute()
const toast = useToastStore()
const userId = route.params.id as string
const query = useUser(userId)
const user = computed(() => query.data.value)
const updateMutation = useUpdateUser()

const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: 'Overview', icon: 'User' },
  { key: 'activity', label: 'Activity', icon: 'History' },
  { key: 'settings', label: 'Settings', icon: 'Settings' }
]

const sections = [
  { id: 'section-identity', title: 'Profile Identity', subtitle: 'Step 01' },
  { id: 'section-audit', title: 'Audit Trail', subtitle: 'Step 02' }
]

const isEditing = ref(false)
const form = ref({
  name: '',
  phoneNumber: '',
  status: 'Active'
})

watchEffect(() => {
  if (user.value) {
    form.value = {
      name: user.value.name,
      phoneNumber: user.value.phoneNumber || '',
      status: user.value.status
    }
  }
})

async function handleSave() {
  try {
    await updateMutation.mutateAsync({
      id: userId,
      payload: {
        ...form.value,
        isActive: form.value.status === 'Active'
      }
    })
    toast.success('User profile updated successfully')
    isEditing.value = false
    query.refetch()
  } catch (err) {
    toast.error('Failed to update user profile')
  }
}
</script>
