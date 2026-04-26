<template>
  <div
    v-if="query.isLoading.value"
    class="py-32"
  >
    <LoadingState text="Synchronizing hub parameters..." />
  </div>
  <ErrorState
    v-else-if="query.isError.value"
    title="Hub Synchronization Failed"
    :message="query.error.value?.message"
    show-retry
    @retry="query.refetch"
  />
  <div
    v-else-if="branch"
    class="space-y-10 pb-20"
  >
    <!-- Page Header (Pixel Standard) -->
    <DetailPageHeader
      :title="branch.name"
      description="Regional operational hub management, resource allocation, and localized parameter configuration."
      back-to="/admin/branches"
      back-label="Infrastructure Matrix"
    >
      <template #status>
        <div class="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] shrink-0">
          <div 
            class="w-1.5 h-1.5 rounded-full"
            :class="branch.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
          />
          <span class="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">
            {{ branch.isActive ? 'Active' : 'Offline' }}
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="secondary"
            size="sm"
            class="bg-white border-slate-100 px-6"
          >
            <template #icon>
              <Settings class="w-3.5 h-3.5 mr-2.5 text-slate-400" />
            </template>
            Hub Config
          </AppButton>
        </div>
      </template>
    </DetailPageHeader>

    <div class="space-y-12">
      <!-- Premium Sticky Sub-Nav -->
      <div class="sticky top-0 z-40 -mx-8 px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 mb-12">
        <div class="max-w-[1200px] mx-auto">
          <DetailTabs
            v-model="activeTab"
            :tabs="tabs"
          />
        </div>
      </div>

      <div class="min-h-[400px]">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'">
          <AdminWizardLayout
            :sections="sections"
            title="Hub Overview"
          >
            <!-- Identity Section -->
            <AppCard
              id="identity"
              class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm"
            >
              <EditorialHeader title="Identity & Narrative">
                <template #actions>
                  <button
                    v-if="!isEditing"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="startEditing"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Hub</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="!isEditing"
                class="space-y-16 animate-in fade-in duration-700"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Hub Name
                    </p>
                    <p class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                      {{ branch.name }}
                    </p>
                  </div>
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      System Identifier
                    </p>
                    <p class="text-[15px] font-black text-violet-600 tracking-tighter uppercase leading-none font-mono">
                      {{ branch.identifier }}
                    </p>
                  </div>
                  <div class="md:col-span-2 space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Geographic Parameters
                    </p>
                    <p class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-relaxed max-w-3xl">
                      {{ branch.location || 'No specific geographic constraints established.' }}
                    </p>
                  </div>
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Operational Status
                    </p>
                    <div class="flex items-center gap-2.5">
                      <div 
                        class="w-1.5 h-1.5 rounded-full"
                        :class="branch.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
                      />
                      <span class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                        {{ branch.isActive ? 'Online / Accepting Contributions' : 'Offline / Restricted Access' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div class="grid md:grid-cols-2 gap-12">
                  <AppInput
                    v-model="form.name"
                    label="Hub Name"
                    placeholder="Regional name"
                    required
                  />
                  <AppInput
                    v-model="form.identifier"
                    label="System ID"
                    placeholder="UNIQUE-CODE"
                    required
                  />
                </div>
                <AppTextarea
                  v-model="form.location"
                  label="Geographic Parameters"
                  placeholder="Detailed location or range..."
                  :rows="3"
                />
                <div class="flex items-center gap-4 pt-4">
                  <AppSwitch v-model="form.isActive" />
                  <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Active State</span>
                </div>
              </div>
            </AppCard>

            <!-- Metrics / Resources (Placeholder) -->
            <AppCard
              id="resources"
              class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm relative overflow-hidden group"
            >
              <EditorialHeader
                title="Resource Allocation"
                subtitle="Operational Matrix"
              />
              <div class="py-20 flex flex-col items-center justify-center border border-dashed border-slate-100 bg-slate-50/30 rounded-3xl gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-200">
                  <LayoutGrid class="w-6 h-6" />
                </div>
                <div class="text-center">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Resource Monitoring
                  </p>
                  <p class="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1 italic">
                    Real-time telemetry pending synchronization
                  </p>
                </div>
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <!-- Events Tab -->
        <div
          v-else-if="activeTab === 'events'"
          class="space-y-12 animate-in fade-in duration-500"
        >
          <BranchEventsList :branch-id="branchId" />
        </div>

        <!-- Activity Tab -->
        <div
          v-else-if="activeTab === 'activity'"
          class="max-w-4xl"
        >
          <AppCard class="!p-16 border-slate-100">
            <EditorialHeader title="System Audit Stream" />
            <div class="py-20 flex flex-col items-center justify-center gap-4">
              <History class="w-8 h-8 text-slate-100" />
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                No Recent Audit Logs
              </p>
            </div>
          </AppCard>
        </div>

        <!-- Settings Tab -->
        <div
          v-else-if="activeTab === 'settings'"
          class="max-w-4xl space-y-12"
        >
          <AppCard class="!p-16 border-slate-100">
            <EditorialHeader title="Advanced Hub Configuration" />
            <div class="space-y-12 mt-12">
              <div class="flex items-center justify-between p-12 bg-rose-50/30 border border-rose-100">
                <div class="space-y-3">
                  <p class="text-[13px] font-black text-rose-900 tracking-tighter uppercase leading-none">
                    Decommission Hub
                  </p>
                  <p class="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-none">
                    Permanently remove this hub from the active infrastructure matrix
                  </p>
                </div>
                <AppButton
                  variant="danger"
                  size="sm"
                  class="!rounded-2xl"
                  @click="handleDecommission"
                >
                  <Trash2 class="w-3.5 h-3.5 mr-2" /> Decommission
                </AppButton>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- Inline Edit Actions -->
    <StickyFormActions v-if="isEditing">
      <template #left>
        <div class="flex items-center gap-3">
          <div
            v-if="updateMutation.isPending.value"
            class="flex items-center gap-2"
          >
            <div class="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
            <span class="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Synchronizing matrix...</span>
          </div>
          <span
            v-else
            class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic"
          >Pending hub configuration changes</span>
        </div>
      </template>
      <AppButton
        variant="outline"
        class="bg-transparent border-slate-200 px-10"
        @click="cancelEditing"
      >
        Discard
      </AppButton>
      <AppButton
        variant="primary"
        class="px-12"
        :loading="updateMutation.isPending.value"
        @click="handleSave"
      >
        Sync Hub
      </AppButton>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBranch, useUpdateBranch } from '../composables/useBranches'
import { useToastStore } from '@/shared/stores/useToastStore'
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import EditorialHeader from '@/shared/components/headers/EditorialHeader.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import BranchEventsList from '../components/BranchEventsList.vue'
import { 
  Building2, 
  Settings, 
  Pencil, 
  History, 
  LayoutGrid,
  Trash2,
  Calendar
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const branchId = route.params.id as string

const query = useBranch(branchId)
const branch = computed(() => query.data.value)
const updateMutation = useUpdateBranch()

const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: 'Hub Overview', icon: 'Building2' },
  { key: 'events', label: 'Campaigns', icon: 'Calendar' },
  { key: 'activity', label: 'Audit Trail', icon: 'History' },
  { key: 'settings', label: 'Settings', icon: 'Settings' },
]

const sections = [
  { id: 'identity', title: 'Identity', subtitle: 'Step 01' },
  { id: 'resources', title: 'Resources', subtitle: 'Step 02' },
]

const isEditing = ref(route.query.edit === 'true')
const form = ref({
  name: '',
  identifier: '',
  location: '',
  isActive: true
})

watchEffect(() => {
  if (branch.value && (isEditing.value || !form.value.name)) {
    form.value = {
      name: branch.value.name,
      identifier: branch.value.identifier,
      location: branch.value.location || '',
      isActive: branch.value.isActive
    }
  }
})

function startEditing() {
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
}

async function handleSave() {
  try {
    await updateMutation.mutateAsync({
      id: branchId,
      payload: form.value
    })
    toast.success('Infrastructure matrix synchronized')
    isEditing.value = false
    query.refetch()
  } catch (error) {
    toast.error('Matrix synchronization failed')
  }
}

async function handleDecommission() {
  if (confirm('Permanently decommission this operational hub? This action is recorded in the audit log.')) {
    toast.info('Decommissioning request sent to kernel...')
  }
}
</script>
