<template>
  <div class="space-y-10 pb-32">
    <AdminPageHeader
      title="User Settings"
      description="Manage your personal profile, security preferences, and notification defaults."
    />

    <div class="space-y-10">
      <!-- Navigation Tabs -->
      <div class="sticky top-0 z-40 -mx-8 px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 mb-12">
        <div class="max-w-[1200px] mx-auto">
          <DetailTabs
            v-model="activeTab"
            :tabs="userSettingsTabs"
          />
        </div>
      </div>

      <div class="min-h-[600px]">
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'">
          <AdminWizardLayout
            :sections="profileSections"
            title="Profile Setup"
          >
            <!-- Identity Snapshot Section -->
            <AppCard 
              id="snapshot"
              class="!p-10 border-slate-200 bg-slate-50/50 scroll-mt-24"
            >
              <div class="grid md:grid-cols-3 gap-10">
                <div class="space-y-2">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none italic">
                    Identity Profile
                  </p>
                  <div class="flex items-center gap-4 mt-4">
                    <div class="w-12 h-12 rounded-none bg-violet-600 flex items-center justify-center text-white text-lg font-black">
                      {{ currentUser.name?.charAt(0) }}
                    </div>
                    <div>
                      <p class="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                        {{ name }}
                      </p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        {{ email }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none italic">
                    System Authority
                  </p>
                  <div class="flex items-center gap-3 mt-4">
                    <div class="w-8 h-8 rounded-none bg-violet-600 flex items-center justify-center text-white">
                      <ShieldCheck class="w-4 h-4" />
                    </div>
                    <span class="text-xs font-black text-slate-900 uppercase tracking-tight">
                      {{ me?.isPlatformAdmin ? 'Platform Administrator' : 'Standard Access' }}
                    </span>
                  </div>
                </div>

                <div class="space-y-2">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none italic">
                    Scoped Scopes
                  </p>
                  <div class="flex items-center gap-3 mt-4">
                    <div class="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center text-slate-400">
                      <Target class="w-4 h-4" />
                    </div>
                    <span class="text-xs font-black text-slate-900 uppercase tracking-tight">
                      {{ me?.scopeAssignments?.length || 0 }} Active Assignments
                    </span>
                  </div>
                </div>
              </div>
            </AppCard>

            <!-- Identity Section -->
            <AppCard
              id="identity"
              class="!p-10 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader 
                title="Identity Details"
                class="!mb-8"
              >
                <template #actions>
                  <button
                    v-if="!isEditingProfile"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingProfile = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Profile</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="!isEditingProfile"
                class="space-y-12 animate-in fade-in duration-700"
              >
                <div class="flex items-center gap-8 mb-12">
                  <div class="w-24 h-24 rounded-none bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                    <img
                      v-if="currentUser.picture"
                      :src="currentUser.picture"
                      :alt="currentUser.name"
                      class="w-full h-full object-cover"
                    >
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center bg-violet-50 text-violet-600 text-3xl font-black"
                    >
                      {{ currentUser.name?.charAt(0) }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <p class="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">
                      {{ currentUser.name }}
                    </p>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                      {{ currentUser.email }}
                    </p>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-x-12 gap-y-10">
                  <div class="space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Display Name
                    </p>
                    <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
                      {{ name }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Operational Email
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight italic">
                      {{ email }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Phone Number
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight">
                      {{ phoneNumber || 'Not Configured' }}
                    </p>
                  </div>
                </div>
              </div>

              <section
                v-else
                class="space-y-8 animate-in slide-in-from-top-4 duration-500"
              >
                <div class="flex items-center gap-8 mb-12">
                  <div class="relative group">
                    <div class="w-24 h-24 rounded-none bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                      <img
                        v-if="currentUser.picture"
                        :src="currentUser.picture"
                        :alt="currentUser.name"
                        class="w-full h-full object-cover"
                      >
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center bg-violet-50 text-violet-600 text-3xl font-black"
                      >
                        {{ currentUser.name?.charAt(0) }}
                      </div>
                    </div>
                    <button class="absolute -bottom-2 -right-2 w-8 h-8 rounded-none bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-violet-600 transition-colors">
                      <Camera class="w-4 h-4" />
                    </button>
                  </div>
                  <div class="space-y-1">
                    <p class="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">
                      {{ currentUser.name }}
                    </p>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                      {{ currentUser.email }}
                    </p>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-10">
                  <AppInput
                    v-model="name"
                    label="Display Name"
                    placeholder="Your name"
                  />
                  <AppInput
                    v-model="email"
                    label="Email Address"
                    placeholder="email@mftl.com"
                    disabled
                  />
                  <AppInput
                    v-model="phoneNumber"
                    label="Phone Number"
                    placeholder="+233..."
                  />
                </div>
              </section>
            </AppCard>

            <!-- Preferences Section -->
            <AppCard
              id="preferences"
              class="!p-10 space-y-8 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader 
                title="Regional Preferences"
                class="!mb-8"
              >
                <template #actions>
                  <button
                    v-if="!isEditingProfile"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingProfile = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Regional</span>
                  </button>
                </template>
              </EditorialHeader>
              
              <div
                v-if="!isEditingProfile"
                class="grid md:grid-cols-2 gap-10"
              >
                <div class="space-y-2">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Preferred Language
                  </p>
                  <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
                    English (Ghana)
                  </p>
                </div>
                <div class="space-y-2">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Local Timezone
                  </p>
                  <p class="text-sm font-black text-slate-900 uppercase tracking-tight italic">
                    Greenwich Mean Time (GMT)
                  </p>
                </div>
              </div>

              <div
                v-else
                class="grid md:grid-cols-2 gap-10 animate-in slide-in-from-top-2 duration-500"
              >
                <AppSelect 
                  label="Preferred Language" 
                  :model-value="'en-GH'"
                  :options="[
                    { label: 'English (Ghana)', value: 'en-GH' },
                    { label: 'English (US)', value: 'en-US' }
                  ]"
                />
                <AppSelect 
                  label="Timezone" 
                  :model-value="'GMT'"
                  :options="[
                    { label: 'Greenwich Mean Time (GMT)', value: 'GMT' },
                    { label: 'Universal Time (UTC)', value: 'UTC' }
                  ]"
                />
              </div>
            </AppCard>

            <template #sidebar-footer>
              <div class="pt-10 space-y-6">
                <div class="p-4 bg-slate-50 border border-slate-100 rounded-none">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Sync Status
                  </p>
                  <div class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-none bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Auth0 Synchronized</span>
                  </div>
                </div>
              </div>
            </template>
          </AdminWizardLayout>
        </div>

        <!-- Roles Tab -->
        <div v-if="activeTab === 'roles'">
          <AdminWizardLayout
            :sections="rolesSections"
            title="Authorization"
          >
            <AppCard
              id="matrix"
              class="!p-10 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader 
                title="Current Authorization Matrix"
                class="!mb-8"
              />
              
              <div
                v-if="meQuery.isLoading.value"
                class="py-12"
              >
                <LoadingState text="Fetching security profile..." />
              </div>

              <div
                v-else-if="me?.scopeAssignments.length || me?.isPlatformAdmin || me?.effectiveRoles?.length"
                class="space-y-8"
              >
                <div
                  v-if="me?.effectiveRoles?.length"
                  class="space-y-4"
                >
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    System Authorization Roles
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="role in me.effectiveRoles" 
                      :key="role"
                      class="px-3 py-1.5 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-none shadow-lg shadow-violet-100"
                    >
                      {{ role }}
                    </span>
                  </div>
                </div>

                <div class="space-y-4">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Local Matrix Assignments
                  </p>
                  <div class="border border-slate-100 rounded-none overflow-hidden shadow-sm divide-y divide-slate-50">
                    <AssignmentListRow 
                      v-if="me.isPlatformAdmin"
                      type="event"
                      title="Global Network Ecosystem"
                      subtitle="System Wide Access"
                      badge="Platform Admin"
                      :is-assigned="true"
                      :is-editing="false"
                    />
                    <AssignmentListRow 
                      v-for="scope in me.scopeAssignments" 
                      :key="scope.id"
                      :type="getScopeRowType(scope.scopeType)"
                      :title="scope.targetName || 'Global System Access'"
                      :subtitle="formatScopeType(scope.scopeType)"
                      :badge="scope.role"
                      :is-assigned="true"
                      :is-editing="false"
                    />
                  </div>
                </div>
              </div>

              <div
                v-else
                class="py-20 border border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 bg-slate-50/30 rounded-none"
              >
                <ShieldAlert class="w-8 h-8 text-slate-200" />
                <div class="text-center">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No Active Scopes Found
                  </p>
                </div>
              </div>
            </AppCard>

            <AppCard
              id="guide"
              class="!p-10 border-slate-200 bg-slate-900 text-white overflow-hidden relative scroll-mt-24"
            >
              <ShieldCheck class="absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.03] text-white" />
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">
                Role Definition Guide
              </h3>
              <div class="grid md:grid-cols-3 gap-10 relative z-10">
                <div class="space-y-3">
                  <p class="text-[10px] font-black text-violet-400 uppercase tracking-widest leading-none italic">
                    Platform Admin
                  </p>
                  <p class="text-[11px] font-bold text-slate-300 leading-relaxed uppercase">
                    Global unrestricted access to all nodes and security parameters.
                  </p>
                </div>
                <div class="space-y-3">
                  <p class="text-[10px] font-black text-violet-400 uppercase tracking-widest leading-none italic">
                    Organisation Admin
                  </p>
                  <p class="text-[11px] font-bold text-slate-300 leading-relaxed uppercase">
                    Full operational control over organization-wide branches.
                  </p>
                </div>
                <div class="space-y-3">
                  <p class="text-[10px] font-black text-violet-400 uppercase tracking-widest leading-none italic">
                    Event Manager
                  </p>
                  <p class="text-[11px] font-bold text-slate-300 leading-relaxed uppercase">
                    Granular management of specific campaigns and collectors.
                  </p>
                </div>
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'">
          <AdminWizardLayout
            :sections="securitySections"
            title="Cyber Security"
          >
            <AppCard
              id="mfa"
              class="!p-10 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader 
                title="Security & Verification"
                class="!mb-8"
              />
              <div class="space-y-6">
                <div class="p-8 bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-6">
                    <div class="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center">
                      <ShieldCheck class="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p class="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                        Password Protected
                      </p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-none">
                        Last changed 3 months ago
                      </p>
                    </div>
                  </div>
                  <AppButton
                    variant="outline"
                    class="bg-white text-[10px] uppercase tracking-widest"
                  >
                    Update
                  </AppButton>
                </div>

                <div class="p-8 bg-violet-50/30 border border-violet-100 flex items-center justify-between">
                  <div class="flex items-center gap-6">
                    <div class="w-12 h-12 bg-white border border-violet-100 flex items-center justify-center">
                      <Fingerprint class="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <p class="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                        Two-Factor Auth
                      </p>
                      <p class="text-[10px] font-bold text-violet-600 uppercase tracking-widest mt-2 leading-none italic">
                        Active
                      </p>
                    </div>
                  </div>
                  <AppButton
                    variant="primary"
                    class="text-[10px] uppercase tracking-widest"
                  >
                    Manage
                  </AppButton>
                </div>
              </div>
            </AppCard>

            <AppCard
              id="sessions"
              class="!p-10 border-slate-200 bg-slate-50/30 scroll-mt-24"
            >
              <EditorialHeader 
                title="Session Control"
                class="!mb-8"
              />
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-white border border-slate-100">
                  <div class="flex items-center gap-4">
                    <div class="w-2 h-2 rounded-none bg-emerald-500" />
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">Current Session</span>
                  </div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Now</span>
                </div>
                <AppButton
                  variant="danger"
                  class="w-full text-[10px] uppercase tracking-widest bg-transparent border-rose-200 text-rose-600"
                >
                  Terminate All Sessions
                </AppButton>
              </div>
            </AppCard>

            <AppCard
              id="danger"
              class="!p-10 border-slate-200 bg-rose-900 text-white relative overflow-hidden scroll-mt-24"
            >
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-rose-300 mb-10 italic">
                Management
              </h3>
              <p class="text-sm font-bold text-rose-100 uppercase tracking-tight leading-relaxed mb-8">
                Permanently deactivate your identity and wipe all associated security tokens.
              </p>
              <AppButton
                variant="danger"
                class="bg-white text-rose-900 hover:bg-rose-50 border-none px-12 py-4 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Purge Account
              </AppButton>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'">
          <AdminWizardLayout
            :sections="notificationsSections"
            title="Dispatch Control"
          >
            <AppCard
              id="alerts"
              class="!p-10 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader 
                title="Dispatch Preferences"
                class="!mb-8"
              >
                <template #actions>
                  <button
                    v-if="!isEditingNotifications"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingNotifications = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Alerts</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="!isEditingNotifications"
                class="space-y-8 animate-in fade-in duration-700"
              >
                <div
                  v-for="alert in [{t:'Contribution Alerts', d:'Active'}, {t:'System Health', d:'Active'}, {t:'Weekly Analytics', d:'Inactive'}]"
                  :key="alert.t"
                  class="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-none"
                >
                  <div>
                    <p class="text-xs font-black text-slate-900 uppercase tracking-tight">
                      {{ alert.t }}
                    </p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {{ alert.d }}
                    </p>
                  </div>
                  <div
                    class="w-2 h-2 rounded-none"
                    :class="alert.d === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'"
                  />
                </div>
              </div>

              <div
                v-else
                class="space-y-8 animate-in slide-in-from-top-2 duration-500"
              >
                <ToggleCard
                  title="Contribution Alerts"
                  description="Real-time notifications."
                  :model-value="true"
                />
                <ToggleCard
                  title="System Health"
                  description="Critical alerts."
                  :model-value="true"
                />
                <ToggleCard
                  title="Weekly Analytics"
                  description="Automated reports."
                  :model-value="false"
                />
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>
      </div>
    </div>

    <!-- Sticky Actions -->
    <StickyFormActions v-if="isAnySectionEditing">
      <template #left>
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-none bg-violet-500 animate-pulse" />
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Strategic configuration mode active</span>
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
          :loading="updateUserMutation.isPending.value"
          @click="saveSettings"
        >
          Save All Changes
        </AppButton>
      </div>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useMe, useUpdateUser } from '@/modules/users/composables/useUsers'
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import ToggleCard from '@/shared/components/cards/ToggleCard.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AssignmentListRow from '@/shared/components/rows/AssignmentListRow.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import EditorialHeader from '@/shared/components/headers/EditorialHeader.vue'
import { 
  Camera, 
  ShieldCheck, 
  Fingerprint, 
  Bell, 
  ShieldAlert, 
  Target,
  Pencil
} from 'lucide-vue-next'

const { currentUser } = useCurrentUser()
const toast = useToastStore()
const updateUserMutation = useUpdateUser()

const isEditingProfile = ref(false)
const isEditingNotifications = ref(false)

const isAnySectionEditing = computed(() => 
  isEditingProfile.value || 
  isEditingNotifications.value
)

function resetAllEdits() {
  isEditingProfile.value = false
  isEditingNotifications.value = false
}

const activeTab = ref('profile')
const userSettingsTabs = [
  { key: 'profile', label: 'Profile', icon: 'User' },
  { key: 'roles', label: 'Roles & Access', icon: 'Target' },
  { key: 'security', label: 'Security', icon: 'Lock' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell' }
]

const profileSections = [
  { id: 'snapshot', title: 'Snapshot', subtitle: 'Global Status' },
  { id: 'identity', title: 'Identity', subtitle: 'Personal Details' },
  { id: 'preferences', title: 'Preferences', subtitle: 'Region & UI' }
]

const rolesSections = [
  { id: 'matrix', title: 'Matrix', subtitle: 'Permissions' },
  { id: 'guide', title: 'Guide', subtitle: 'Definitions' }
]

const securitySections = [
  { id: 'mfa', title: 'MFA', subtitle: 'Verification' },
  { id: 'sessions', title: 'Sessions', subtitle: 'Control' },
  { id: 'danger', title: 'Danger', subtitle: 'Management' }
]

const notificationsSections = [
  { id: 'alerts', title: 'Alerts', subtitle: 'Dispatch' }
]

const meQuery = useMe()
const me = computed(() => meQuery.data.value)

const name = ref(currentUser.value.name)
const email = ref(currentUser.value.email)
const phoneNumber = ref(me.value?.phoneNumber || '')

watch(() => me.value, (newMe) => {
  if (newMe) {
    name.value = newMe.name
    phoneNumber.value = newMe.phoneNumber || ''
  }
}, { immediate: true })

function getScopeRowType(type: string): 'event' | 'fund' {
  const t = type.toLowerCase()
  if (t === 'event' || t === 'platform' || t === 'tenant' || t === 'branch' || t === 'organisation') return 'event'
  return 'fund'
}

function formatScopeType(type: string) {
  if (type === 'Organisation') return 'Full Organization'
  return type
}

async function saveSettings() {
  if (!me.value) return

  try {
    await updateUserMutation.mutateAsync({
      id: me.value.id,
      payload: {
        name: name.value,
        phoneNumber: phoneNumber.value,
        isActive: true
      }
    })
    toast.success('Strategic profile updated and synchronized.')
    resetAllEdits()
    meQuery.refetch()
  } catch (err: any) {
    toast.error(err.message || 'Failed to sync settings.')
  }
}
</script>
