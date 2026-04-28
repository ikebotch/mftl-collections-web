<template>
  <div class="space-y-10 pb-32">
    <DetailPageHeader
      :title="orgName"
      description="Manage organization identity, localization parameters, and system-wide operational switches."
      back-to="/admin/organization"
      back-label="Back to Network"
    />

    <div
      v-if="query.isLoading.value"
      class="py-32"
    >
      <LoadingState text="Syncing configuration matrix..." />
    </div>

    <div
      v-else
      class="space-y-10"
    >
      <!-- Navigation Tabs -->
      <div class="sticky top-0 z-40 -mx-8 px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
        <div class="max-w-[1200px] mx-auto">
          <DetailTabs
            v-model="activeTab"
            :tabs="settingsTabs"
          />
        </div>
      </div>

      <div class="max-w-[1200px] mx-auto space-y-10">
        <div
          v-if="activeTab === 'general'"
          class="animate-in fade-in duration-500"
        >
          <AdminWizardLayout
            :sections="generalSections"
            title="Identity"
          >
            <!-- Organization Identity -->
            <AppCard
              id="intelligence"
              class="!p-10 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader 
                title="General Settings"
                class="!mb-8"
              >
                <template #actions>
                  <button
                    v-if="!isEditingGeneral"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingGeneral = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Details</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="!isEditingGeneral"
                class="space-y-12 animate-in fade-in duration-700"
              >
                <div class="grid md:grid-cols-2 gap-x-12 gap-y-10">
                  <div class="space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Organization Name
                    </p>
                    <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
                      {{ orgName }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Support Email
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight italic">
                      {{ supportEmail }}
                    </p>
                  </div>
                  <div class="md:col-span-2 space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Mission Statement
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight leading-relaxed uppercase">
                      Empowering communities through transparent collection and efficient resource allocation.
                    </p>
                  </div>
                </div>
              </div>
                
              <section
                v-else
                class="space-y-8 animate-in slide-in-from-top-4 duration-500"
              >
                <div class="grid md:grid-cols-2 gap-10">
                  <AppInput
                    v-model="orgNameProxy"
                    label="Organization Name"
                    placeholder="MFTL Foundation"
                  />
                  <AppInput
                    v-model="supportEmail"
                    label="Support Email"
                    placeholder="support@mftl.com"
                  />
                </div>
                  
                <AppTextarea
                  id="mission-statement"
                  label="Mission Statement"
                  placeholder="Define your organizational purpose..."
                  :rows="4"
                  :model-value="'Empowering communities through transparent collection and efficient resource allocation.'"
                />
              </section>
            </AppCard>

            <AppCard
              id="branding"
              class="!p-10 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader title="Media & Branding Assets">
                <template #actions>
                  <button
                    v-if="!isEditingGeneral"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingGeneral = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Media</span>
                  </button>
                </template>
              </EditorialHeader>
              <div
                v-if="!isEditingGeneral"
                class="grid md:grid-cols-2 gap-12 animate-in fade-in duration-700"
              >
                <div class="space-y-4">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Primary Brand Logo
                  </p>
                  <div class="w-24 h-24 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                    <ImageIcon class="w-8 h-8" />
                  </div>
                </div>
                <div class="space-y-4">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Receipt / POS Branding
                  </p>
                  <div class="w-24 h-24 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                    <Printer class="w-8 h-8" />
                  </div>
                </div>
              </div>
              <div
                v-else
                class="grid md:grid-cols-2 gap-12 animate-in slide-in-from-top-2 duration-500"
              >
                <ModernImageInput 
                  v-model="systemLogoProxy"
                  label="Primary Brand Logo"
                  :icon="ImageIcon"
                />
                <ModernImageInput 
                  v-model="posLogoProxy"
                  label="Receipt / POS Branding"
                  :icon="Printer"
                />
              </div>
            </AppCard>
            <AppCard
              id="health"
              class="!p-12 space-y-12 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader
                title="Operational Health Matrix"
                subtitle="Step 03"
              />
                
              <div class="grid md:grid-cols-2 gap-12">
                <!-- Live Operational State (Admin Standard) -->
                <div class="p-12 border border-slate-100 bg-slate-50/50 flex items-start gap-8 relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <div class="w-16 h-20 bg-white border border-slate-100 flex items-center justify-center shrink-0">
                    <Check class="w-8 h-8 text-emerald-500 stroke-[3]" />
                  </div>
                  <div>
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                      Strategic Gateway
                    </p>
                    <h3 class="text-xl font-black text-slate-900 leading-tight uppercase">
                      Paystack<br>Operational Hub
                    </h3>
                    <div class="flex items-center gap-2 mt-4">
                      <div class="w-1.5 h-1.5 rounded-none bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                      <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active: Live Mode</span>
                    </div>
                  </div>
                </div>

                <!-- Cloud Health Matrix -->
                <div class="p-12 border border-slate-100 bg-slate-50/50 flex flex-col justify-center">
                  <h4 class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">
                    Infrastructure Health
                  </h4>
                  <div class="space-y-8">
                    <div class="flex items-center justify-between pb-6 border-b border-slate-200/50">
                      <div class="space-y-1">
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Database Node
                        </p>
                        <p class="text-xs font-black text-slate-900 uppercase tracking-tight">
                          PostgreSQL Cluster
                        </p>
                      </div>
                      <span class="text-[10px] font-black uppercase text-emerald-500">Optimal</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="space-y-1">
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Storage Status
                        </p>
                        <p class="text-xs font-black text-slate-900 uppercase tracking-tight">
                          Cloud Capacity
                        </p>
                      </div>
                      <span class="text-[10px] font-black uppercase text-emerald-500">92% Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <!-- Regional Tab Content -->
        <div
          v-if="activeTab === 'regional'"
          class="animate-in fade-in duration-500"
        >
          <AdminWizardLayout
            :sections="regionalSections"
            title="Global Parameters"
          >
            <AppCard
              id="localization"
              class="!p-10 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader 
                title="Localization Parameters"
                class="!mb-8"
              >
                <template #actions>
                  <button
                    v-if="!isEditingRegional"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingRegional = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Localization</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="!isEditingRegional"
                class="grid md:grid-cols-2 gap-10 animate-in fade-in duration-700"
              >
                <div class="space-y-2">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Operational Currency
                  </p>
                  <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Ghana Cedi (GHS)
                  </p>
                </div>
                <div class="space-y-2">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    System Locale
                  </p>
                  <p class="text-sm font-black text-slate-900 uppercase tracking-tight italic">
                    English (Ghana)
                  </p>
                </div>
              </div>

              <div
                v-else
                class="grid md:grid-cols-2 gap-10 animate-in slide-in-from-top-2 duration-500"
              >
                <AppSelect 
                  label="Operational Currency" 
                  :model-value="'GHS'"
                  :options="[
                    { label: 'Ghana Cedi (GHS)', value: 'GHS' },
                    { label: 'US Dollar (USD)', value: 'USD' },
                    { label: 'British Pound (GBP)', value: 'GBP' }
                  ]"
                />
                <AppSelect 
                  label="System Locale" 
                  :model-value="'en-GH'"
                  :options="[
                    { label: 'English (Ghana)', value: 'en-GH' },
                    { label: 'English (Global)', value: 'en-US' }
                  ]"
                />
              </div>

              <div class="p-8 bg-violet-50/30 border border-violet-100 flex items-center justify-between">
                <div class="space-y-1.5">
                  <p class="text-sm font-black text-slate-900 uppercase tracking-tight italic leading-none">
                    Multi-Currency Stream
                  </p>
                  <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Authorized contribution flows across supported financial channels.
                  </p>
                </div>
                <div class="flex gap-2">
                  <span class="px-3 py-1 bg-white border border-violet-200 text-violet-600 text-[9px] font-black uppercase tracking-widest">GHS</span>
                  <span class="px-3 py-1 bg-white border border-violet-200 text-violet-600 text-[9px] font-black uppercase tracking-widest">USD</span>
                </div>
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <!-- Infrastructure Tab Content -->
        <div
          v-if="activeTab === 'infrastructure'"
          class="animate-in fade-in duration-500"
        >
          <AdminWizardLayout
            :sections="infrastructureSections"
            title="Network Core"
          >
            <AppCard
              id="topology"
              class="!p-10 space-y-8 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader title="Organizational Structure">
                <template #actions>
                  <button
                    v-if="!isEditingInfrastructure"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingInfrastructure = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Structure</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="!isEditingInfrastructure"
                class="space-y-10 animate-in fade-in duration-700"
              >
                <div class="grid md:grid-cols-2 gap-10">
                  <div class="space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Operational API Endpoint
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight italic">
                      https://api.mftl.com/v1
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Secure Storefront URL
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight italic">
                      https://give.mftl.com
                    </p>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="space-y-8 animate-in slide-in-from-top-2 duration-500"
              >
                <div class="grid md:grid-cols-2 gap-10">
                  <AppInput
                    label="Operational API Endpoint"
                    :model-value="'https://api.mftl.com/v1'"
                  />
                  <AppInput
                    label="Secure Storefront URL"
                    :model-value="'https://give.mftl.com'"
                  />
                </div>
              </div>
            </AppCard>

            <AppCard
              id="hubs"
              class="!p-12 border-slate-200 bg-slate-50/30 scroll-mt-24"
            >
              <EditorialHeader title="Regional Hub Registry">
                <template #actions>
                  <button
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="router.push('/admin/branches/new')"
                  >
                    <Plus class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Deploy New Hub</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="branches?.length"
                class="mt-10 space-y-4"
              >
                <div 
                  v-for="branch in branches" 
                  :key="branch.id"
                  class="p-6 bg-white border border-slate-100 flex items-center justify-between hover:border-violet-200 transition-colors cursor-pointer group"
                  @click="router.push(`/admin/branches/${branch.id}`)"
                >
                  <div class="flex items-center gap-6">
                    <div class="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-lg">
                      <MapPin class="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                    </div>
                    <div>
                      <p class="text-[13px] font-black text-slate-900 tracking-tight uppercase leading-none">
                        {{ branch.name }}
                      </p>
                      <div class="flex items-center gap-2 mt-2">
                        <div
                          class="w-1.5 h-1.5 rounded-full"
                          :class="branch.isActive ? 'bg-emerald-500' : 'bg-slate-300'"
                        />
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ branch.isActive ? 'Operational' : 'Offline' }}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight class="w-4 h-4 text-slate-300 group-hover:text-violet-600 transition-all transform group-hover:translate-x-1" />
                </div>
              </div>

              <div
                v-else
                class="mt-10 py-16 flex flex-col items-center justify-center border border-dashed border-slate-200 text-center gap-4"
              >
                <div class="w-12 h-12 bg-white border border-slate-100 flex items-center justify-center text-slate-200">
                  <Building2 class="w-6 h-6" />
                </div>
                <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    No active hubs deployed
                  </p>
                  <p class="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">
                    Regional infrastructure matrix is empty
                  </p>
                </div>
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <!-- Operational Tab Content -->
        <div
          v-if="activeTab === 'operational'"
          class="animate-in fade-in duration-500"
        >
          <AdminWizardLayout
            :sections="operationalSections"
            title="Execution Logic"
          >
            <AppCard
              id="controls"
              class="!p-8 space-y-8 border-slate-200 bg-white scroll-mt-24"
            >
              <EditorialHeader 
                title="System Controls"
                class="!mb-8"
              >
                <template #actions>
                  <button
                    v-if="!isEditingOperational"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingOperational = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Controls</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="!isEditingOperational"
                class="space-y-6 animate-in fade-in duration-700"
              >
                <div
                  v-for="ctrl in [{t:'Auth0 Dev Bypass', v:'Active', s:'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}, {t:'Maintenance Guard', v:'Inactive', s:'bg-slate-300'}, {t:'Public Leaderboard', v:'Active', s:'bg-emerald-500'}]"
                  :key="ctrl.t"
                  class="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-none"
                >
                  <div>
                    <p class="text-xs font-black text-slate-900 uppercase tracking-tight">
                      {{ ctrl.t }}
                    </p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {{ ctrl.v }}
                    </p>
                  </div>
                  <div
                    class="w-2 h-2 rounded-none"
                    :class="ctrl.s"
                  />
                </div>
              </div>

              <div
                v-else
                class="space-y-6 animate-in slide-in-from-top-2 duration-500"
              >
                <div class="flex items-center justify-between p-4 bg-slate-50 border border-slate-100">
                  <div class="space-y-1">
                    <p class="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                      Auth0 Dev Bypass
                    </p>
                    <p class="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">
                      Active
                    </p>
                  </div>
                  <div class="w-2 h-2 rounded-none bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>
                <ToggleCard
                  title="Maintenance Guard"
                  description="Halt all operational streams."
                  :model-value="false"
                />
                <ToggleCard
                  title="Public Leaderboard"
                  description="Expose performance audits."
                  :model-value="true"
                />
              </div>
            </AppCard>

            <AppCard
              id="audit"
              class="!p-10 space-y-10 border-slate-200 scroll-mt-24"
            >
              <EditorialHeader
                title="Audit & Event Log"
                subtitle="Step 02"
              />
              <div class="space-y-6">
                <div 
                  v-for="i in 3" 
                  :key="i"
                  class="flex gap-4 pb-6 border-b border-slate-50 last:border-0"
                >
                  <div class="w-8 h-8 rounded-none bg-slate-50 flex items-center justify-center shrink-0">
                    <Activity class="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p class="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                      System Configuration Updated
                    </p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Platform Admin • 2 hours ago
                    </p>
                  </div>
                </div>
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
          <div class="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Network configuration mode active</span>
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
          @click="saveConfiguration"
        >
          Save Global Strategy
        </AppButton>
      </div>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTenantSettings } from '../composables/useTenantSettings'
import { useTenants } from '../composables/useTenants'
import { useBranches } from '../composables/useBranches'
import { tenantsService } from '../services/tenantsService'
import { useToastStore } from '@/shared/stores/useToastStore'
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import ToggleCard from '@/shared/components/cards/ToggleCard.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ModernImageInput from '@/shared/components/forms/ModernImageInput.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import EditorialHeader from '@/shared/components/headers/EditorialHeader.vue'
import { Check, Copy as CopyIcon, Image as ImageIcon, Printer, Building2, Settings2, Globe, Network, Activity, Pencil, MapPin, ArrowRight, Plus } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const toast = useToastStore()

const tenantId = computed(() => route.params.id as string)
const query = useTenantSettings(tenantId)
const { data: tenants } = useTenants()
const { data: branches } = useBranches(tenantId)

const isEditingGeneral = ref(false)
const isEditingRegional = ref(false)
const isEditingInfrastructure = ref(false)
const isEditingOperational = ref(false)

const isAnySectionEditing = computed(() => 
  isEditingGeneral.value || 
  isEditingRegional.value || 
  isEditingInfrastructure.value ||
  isEditingOperational.value
)

function resetAllEdits() {
  isEditingGeneral.value = false
  isEditingRegional.value = false
  isEditingInfrastructure.value = false
  isEditingOperational.value = false
}

const activeTab = ref('general')

const settingsTabs = [
  { key: 'general', label: 'General', icon: 'Settings2' },
  { key: 'users', label: 'Users', icon: 'Users' },
  { key: 'regional', label: 'Regional', icon: 'Globe' },
  { key: 'infrastructure', label: 'Infrastructure', icon: 'Network' },
  { key: 'operational', label: 'Operational', icon: 'Activity' }
]

const generalSections = [
  { id: 'intelligence', title: 'Identity' },
  { id: 'branding', title: 'Appearance' },
  { id: 'health', title: 'System' }
]

const regionalSections = [
  { id: 'localization', title: 'Region' }
]

const infrastructureSections = [
  { id: 'topology', title: 'Regional Setup' },
  { id: 'hubs', title: 'Branches' }
]

const operationalSections = [
  { id: 'controls', title: 'Settings' },
  { id: 'audit', title: 'Activity' }
]

const orgName = computed(() => {
  const t = tenants.value?.find(x => x.id === tenantId.value)
  return t?.name || 'Organization Details'
})

const orgNameProxy = ref('')
const supportEmail = ref('support@mftl.com')
const systemLogoProxy = ref('')
const posLogoProxy = ref('')

watch(() => orgName.value, (newVal) => {
  if (newVal) orgNameProxy.value = newVal
}, { immediate: true })

function copyTenantId() {
  navigator.clipboard.writeText(tenantId.value)
  toast.success('Organization identifier copied')
}

async function saveConfiguration() {
  try {
    await tenantsService.update(tenantId.value, {
      name: orgNameProxy.value,
      supportEmail: supportEmail.value
    })
    toast.success('Global configuration synchronized successfully')
    resetAllEdits()
    query.refetch()
  } catch (error) {
    toast.error('Failed to synchronize organization matrix')
  }
}
</script>
