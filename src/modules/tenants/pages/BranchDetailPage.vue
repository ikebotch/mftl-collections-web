<template>
  <div class="space-y-10 pb-32">
    <DetailPageHeader
      :title="branch?.name"
      description="Regional operational hub management, resource allocation, and localized parameter configuration."
      back-to="/admin/branches"
      back-label="Branches"
    >
      <template #status>
        <div class="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] shrink-0">
          <div 
            class="w-1.5 h-1.5 rounded-full"
            :class="branch?.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
          />
          <span class="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">
            {{ branch?.isActive ? 'Active Node' : 'Offline' }}
          </span>
        </div>
      </template>
    </DetailPageHeader>

    <div
      v-if="query.isLoading.value"
      class="py-32"
    >
      <LoadingState text="Synchronizing hub parameters..." />
    </div>

    <div
      v-else-if="branch"
      class="space-y-10"
    >
      <!-- Navigation Tabs -->
      <div class="sticky top-0 z-40 -mx-8 px-8 bg-transparent border-b border-slate-200/60 py-4 mb-10">
        <div class="max-w-[1200px] mx-auto">
          <DetailTabs
            v-model="activeTab"
            :tabs="tabs"
          />
        </div>
      </div>

      <div class="max-w-[1200px] mx-auto">
        <!-- Hub Overview Tab -->
        <div
          v-if="activeTab === 'overview'"
          class="animate-in fade-in duration-500"
        >
          <AdminWizardLayout
            :sections="overviewSections"
            title="Branch Details"
          >
            <!-- Identity Section -->
            <AppCard
              id="identity"
              class="!p-12 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader title="About">
                <template #actions>
                  <button
                    v-if="!isEditingOverview"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingOverview = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Details</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="!isEditingOverview"
                class="space-y-12 animate-in fade-in duration-700"
              >
                <div class="grid md:grid-cols-2 gap-12">
                  <div class="space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Hub Name
                    </p>
                    <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
                      {{ branch.name }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      System ID
                    </p>
                    <p class="text-sm font-black text-violet-600 tracking-tight font-mono">
                      {{ branch.identifier }}
                    </p>
                  </div>
                  <div class="md:col-span-2 space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Geographic Parameters
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight leading-relaxed uppercase">
                      {{ branch.location || 'No specific geographic constraints established.' }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="space-y-8 animate-in slide-in-from-top-4 duration-500"
              >
                <div class="grid md:grid-cols-2 gap-10">
                  <AppInput
                    v-model="form.name"
                    label="Hub Name"
                  />
                  <AppInput
                    v-model="form.identifier"
                    label="System Identifier"
                  />
                </div>
                <AppTextarea
                  v-model="form.location"
                  label="Geographic Parameters"
                  :rows="3"
                />
              </div>
            </AppCard>

            <!-- Topology Section -->
            <AppCard
              id="topology"
              class="!p-12 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader title="Hub Structure">
                <template #actions>
                  <button
                    v-if="!isEditingOverview"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingOverview = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Structure</span>
                  </button>
                </template>
              </EditorialHeader>
              
              <div
                v-if="!isEditingOverview"
                class="grid md:grid-cols-2 gap-10"
              >
                <div class="space-y-2">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Active State
                  </p>
                  <div class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-none bg-emerald-500" />
                    <span class="text-[10px] font-black uppercase">{{ branch.isActive ? 'Hub Online' : 'Offline' }}</span>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="flex items-center gap-4 py-4 animate-in slide-in-from-top-2"
              >
                <AppSwitch v-model="form.isActive" />
                <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Active Hub Status</span>
              </div>
            </AppCard>

            <!-- Health Matrix Section (Standardized) -->
            <AppCard
              id="health"
              class="!p-12 space-y-12 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader
                title="Operational Health Matrix"
                subtitle="Step 03"
              />
              
              <div class="grid md:grid-cols-2 gap-12">
                <div class="p-12 border border-slate-100 bg-slate-50/50 flex items-start gap-8 relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <div class="w-16 h-20 bg-white border border-slate-100 flex items-center justify-center shrink-0">
                    <Check class="w-8 h-8 text-emerald-500 stroke-[3]" />
                  </div>
                  <div>
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                      Regional Status
                    </p>
                    <h3 class="text-xl font-black text-slate-900 leading-tight uppercase">
                      Localized<br>Operational Hub
                    </h3>
                    <div class="flex items-center gap-2 mt-4">
                      <div class="w-1.5 h-1.5 rounded-none bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                      <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active: Primary</span>
                    </div>
                  </div>
                </div>

                <div class="p-12 border border-slate-100 bg-slate-50/50 flex flex-col justify-center">
                  <h4 class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">
                    Localized Telemetry
                  </h4>
                  <div class="space-y-8">
                    <div class="flex items-center justify-between pb-6 border-b border-slate-200/50">
                      <div class="space-y-1">
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Resource Allocation
                        </p>
                        <p class="text-xs font-black text-slate-900 uppercase tracking-tight">
                          System Optimal
                        </p>
                      </div>
                      <span class="text-[10px] font-black uppercase text-emerald-500">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <!-- Campaigns Tab -->
        <div
          v-else-if="activeTab === 'events'"
          class="animate-in fade-in duration-500"
        >
          <BranchEventsList :branch-id="branchId" />
        </div>

        <!-- Audit Trail Tab -->
        <div
          v-else-if="activeTab === 'activity'"
          class="animate-in fade-in duration-500"
        >
          <AppCard class="!p-12 border-slate-200">
            <EditorialHeader title="Regional Audit Stream" />
            <div class="py-24 flex flex-col items-center justify-center gap-4 text-slate-200">
              <History class="w-10 h-10" />
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                No recent operational logs detected
              </p>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- Global Sticky Actions -->
    <StickyFormActions v-if="isAnySectionEditing">
      <template #left>
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Infrastructure configuration active</span>
        </div>
      </template>
      <div class="flex gap-4">
        <AppButton
          variant="outline"
          class="px-8"
          @click="resetAllEdits"
        >
          Discard
        </AppButton>
        <AppButton
          variant="primary"
          class="px-12"
          :loading="updateMutation.isPending.value"
          @click="handleSave"
        >
          Sync Hub Matrix
        </AppButton>
      </div>
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
import { Check, Building2, Settings, Pencil, History, LayoutGrid, Trash2, Calendar, Activity } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const branchId = computed(() => route.params.id as string)
const query = useBranch(branchId)
const branch = computed(() => query.data.value)
const updateMutation = useUpdateBranch()

const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: 'Hub Overview', icon: 'Building2' },
  { key: 'events', label: 'Campaigns', icon: 'Calendar' },
  { key: 'activity', label: 'Audit Trail', icon: 'History' }
]

const overviewSections = [
  { id: 'identity', title: 'Identity' },
  { id: 'financial', title: 'Financials' },
  { id: 'operational', title: 'Settings' }
]

const isEditingOverview = ref(route.query.edit === 'true')
const isAnySectionEditing = computed(() => isEditingOverview.value)

const form = ref({
  name: '',
  identifier: '',
  location: '',
  isActive: true
})

watchEffect(() => {
  if (branch.value && (isEditingOverview.value || !form.value.name)) {
    form.value = {
      name: branch.value.name,
      identifier: branch.value.identifier,
      location: branch.value.location || '',
      isActive: branch.value.isActive
    }
  }
})

function resetAllEdits() {
  isEditingOverview.value = false
}

async function handleSave() {
  try {
    await updateMutation.mutateAsync({
      id: branchId,
      payload: form.value
    })
    toast.success('Infrastructure matrix synchronized')
    isEditingOverview.value = false
    query.refetch()
  } catch (error) {
    toast.error('Matrix synchronization failed')
  }
}
</script>
