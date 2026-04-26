<template>
  <div
    v-if="query.isLoading.value"
    class="py-32"
  >
    <LoadingState text="Syncing collector records..." />
  </div>
  <ErrorState
    v-else-if="query.isError.value"
    title="Operational Sync Failed"
    :message="query.error.value?.message ?? 'Unknown error'"
    show-retry
    @retry="query.refetch"
  />
  <div
    v-else-if="collector"
    class="space-y-10 pb-20"
  >
    <!-- 1. Header (Pixel Standard) -->
    <DetailPageHeader
      :title="collector.name"
      description="Field operations management, assignment control, and performance auditing."
      back-to="/admin/collectors"
      back-label="Collectors List"
    >
      <template #status>
        <div class="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] shrink-0">
          <div 
            class="w-1.5 h-1.5 rounded-full"
            :class="collector.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
          />
          <span class="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">
            {{ collector.status }}
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="secondary"
            size="sm"
            class="bg-white border-slate-100 px-6 whitespace-nowrap"
            @click="exportPerformance"
          >
            <template #icon>
              <Download class="w-3.5 h-3.5 mr-2.5 text-slate-400" />
            </template>
            Export Log
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
            :sections="overviewSections" 
            title="Collector Sections"
          >
            <!-- Identity Section -->
            <AppCard 
              id="section-identity"
              class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm"
            >
              <EditorialHeader 
                title="Staff Identity" 
                subtitle="Step 01"
              >
                <template #actions>
                  <button
                    v-if="!isEditing"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="startEditing"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit Profile</span>
                  </button>
                </template>
              </EditorialHeader>

              <div
                v-if="!isEditing"
                class="space-y-16"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
                  <!-- Full Name -->
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Staff Member
                    </p>
                    <p class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                      {{ collector.name }}
                    </p>
                  </div>
                  
                  <!-- Email -->
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Operational Email
                    </p>
                    <p class="text-[15px] font-black text-slate-900 tracking-tighter italic leading-none">
                      {{ collector.email }}
                    </p>
                  </div>

                  <!-- Phone -->
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Field Contact
                    </p>
                    <p class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                      {{ collector.phoneNumber || 'No contact established.' }}
                    </p>
                  </div>

                  <!-- Status -->
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Account Status
                    </p>
                    <div class="flex items-center gap-2.5">
                      <div 
                        class="w-1.5 h-1.5 rounded-full"
                        :class="collector.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'"
                      />
                      <span class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                        {{ collector.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit Mode -->
              <div
                v-else
                class="space-y-12"
              >
                <div class="grid md:grid-cols-2 gap-12">
                  <AppInput
                    v-model="form!.name"
                    label="Full Name"
                    placeholder="Staff name"
                    required
                  />
                  <AppInput
                    v-model="form!.email"
                    label="Email Address"
                    type="email"
                    required
                  />
                </div>
                <div class="grid md:grid-cols-2 gap-12">
                  <AppInput
                    v-model="form!.phoneNumber"
                    label="Phone Number"
                    placeholder="+233..."
                  />
                  <AppSelect
                    v-model="form!.branchId"
                    label="Assigned Branch"
                    placeholder="Select operational branch"
                    :options="branchOptions"
                    :loading="isLoadingBranches"
                    required
                  />
                </div>
                <div class="grid md:grid-cols-2 gap-12 pt-4">
                  <AppSelect
                    v-model="form!.status"
                    label="Account Status"
                    :options="[
                      { label: 'Active', value: 'Active' },
                      { label: 'Inactive', value: 'Inactive' },
                      { label: 'Suspended', value: 'Suspended' }
                    ]"
                  />
                </div>
              </div>
            </AppCard>

            <!-- Assignments Section -->
            <AppCard 
              id="section-assignments"
              class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm"
            >
              <EditorialHeader 
                title="Campaign Scope" 
                subtitle="Step 02"
              >
                <template #actions>
                  <button
                    v-if="!isEditingCampaigns"
                    type="button"
                    class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                    @click="isEditingCampaigns = true"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Manage Access</span>
                  </button>
                </template>
              </EditorialHeader>

              <div class="space-y-10">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Authorize entire campaigns or select specific funds for this staff member:
                </p>
                
                <!-- Search Interface (Edit Mode Only) -->
                <div
                  v-if="isEditing"
                  class="space-y-6"
                >
                  <div class="relative group">
                    <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                    <input 
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search campaigns or specific funds..."
                      class="w-full bg-slate-50/50 border border-slate-100 py-4 pl-14 pr-6 text-xs font-bold uppercase tracking-widest placeholder:text-slate-300 focus:outline-none focus:border-violet-200 focus:bg-white transition-all"
                    >
                  </div>

                  <!-- Search Results -->
                  <div
                    v-if="searchQuery && groupedSearchResults.length > 0"
                    class="space-y-6"
                  >
                    <h4 class="text-[9px] font-black text-violet-600 uppercase tracking-[0.3em] mb-4">
                      Available for Assignment
                    </h4>
                    <div class="grid gap-4">
                      <div 
                        v-for="group in groupedSearchResults" 
                        :key="group.eventId"
                        class="border border-slate-100 bg-white rounded-lg overflow-hidden shadow-sm"
                      >
                        <AssignmentListRow 
                          v-bind="group.event"
                          :is-editing="true"
                          @action="handleSearchAction(group.event)"
                        />
                        <div
                          v-if="group.funds.length > 0"
                          class="bg-slate-50/10"
                        >
                          <AssignmentListRow 
                            v-for="fund in group.funds" 
                            :key="fund.uniqueKey"
                            v-bind="fund"
                            :is-editing="true"
                            :is-sub-item="true"
                            @action="handleSearchAction(fund)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else-if="searchQuery"
                    class="py-12 border border-dashed border-slate-100 flex flex-col items-center justify-center gap-4"
                  >
                    <SearchX class="w-8 h-8 text-slate-100" />
                    <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      No matching campaigns or funds
                    </p>
                  </div>
                </div>

                <!-- Assigned Scope (Read Mode or Edit Mode Bottom) -->
                <div
                  class="space-y-6"
                  :class="{ 'pt-10 border-t border-slate-100': isEditing }"
                >
                  <h4
                    v-if="isEditing"
                    class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4"
                  >
                    Current Authorized Scope
                  </h4>
                  
                  <div
                    v-if="groupedAssignedItems.length > 0"
                    class="grid gap-4"
                  >
                    <div 
                      v-for="group in groupedAssignedItems" 
                      :key="group.eventId"
                      class="border border-slate-100 bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <AssignmentListRow 
                        v-bind="group.event"
                        :is-assigned="true"
                        :is-editing="isEditing"
                        @action="handleRemoveAction(group.event)"
                      />
                      <div
                        v-if="group.funds.length > 0"
                        class="bg-slate-50/10"
                      >
                        <AssignmentListRow 
                          v-for="fund in group.funds" 
                          :key="fund.uniqueKey"
                          v-bind="fund"
                          :is-assigned="true"
                          :is-editing="isEditing"
                          :is-sub-item="true"
                          @action="handleRemoveAction(fund)"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="py-20 border border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 bg-slate-50/30"
                  >
                    <ShieldAlert class="w-8 h-8 text-slate-100" />
                    <div class="text-center space-y-2">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        No Active Assignments
                      </p>
                      <p
                        v-if="!isEditing"
                        class="text-[9px] font-bold text-slate-300 uppercase tracking-widest"
                      >
                        Edit profile to establish campaign scope
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AppCard>


            <!-- Metrics / Stats Section -->
            <AppCard 
              id="section-metrics"
              class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm"
            >
              <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 mb-16">
                Performance Intelligence
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-12">
                <div class="space-y-3">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Raised Today
                  </p>
                  <p class="text-2xl font-black text-slate-900 italic tracking-tighter">
                    {{ formatCurrency(collector.totalCollectedToday, 'GHS') }}
                  </p>
                </div>
                <div class="space-y-3">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Receipts Issued
                  </p>
                  <p class="text-2xl font-black text-slate-900 tracking-tighter">
                    {{ collector.receiptsIssuedToday }}
                  </p>
                </div>
                <div class="space-y-3">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Assigned Funds
                  </p>
                  <p class="text-2xl font-black text-slate-900 tracking-tighter">
                    {{ collector.assignedFundCount }}
                  </p>
                </div>
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <div
          v-else-if="activeTab === 'assignments'"
          class="space-y-12"
        >
          <div class="max-w-4xl mx-auto space-y-12">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80">
              Active Campaigns
            </h3>
            <div class="grid gap-6">
              <div 
                v-for="e in collectorEvents" 
                :key="e.id"
                class="p-8 border border-slate-100 bg-white hover:border-violet-200 transition-all flex items-center justify-between group"
              >
                <div class="flex items-center gap-6">
                  <div class="w-14 h-14 bg-slate-50 flex items-center justify-center text-slate-300">
                    <Calendar class="w-6 h-6" />
                  </div>
                  <div class="space-y-2">
                    <h4 class="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">
                      {{ e.title }}
                    </h4>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                      {{ formatDate(e.eventDate) }}
                    </p>
                  </div>
                </div>
                <AppButton
                  variant="ghost"
                  size="sm"
                  class="text-[10px] font-black uppercase tracking-widest"
                  @click="router.push(`/admin/events/${e.id}`)"
                >
                  View Campaign →
                </AppButton>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="activeTab === 'history'"
          class="space-y-12"
        >
          <AppCard class="!p-16 border-slate-100">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 mb-16">
              Operational History
            </h3>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
              Syncing collection stream from field mobile units...
            </p>
          </AppCard>
        </div>

        <div
          v-else-if="activeTab === 'settings'"
          class="space-y-16"
        >
          <AppCard class="!p-16 max-w-4xl border-slate-100">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 mb-16">
              Account Control
            </h3>
            <div class="space-y-12">
              <div class="flex items-center justify-between p-12 bg-rose-50/30 border border-rose-100">
                <div class="space-y-3">
                  <p class="text-[13px] font-black text-rose-900 tracking-tighter uppercase">
                    Suspend Staff
                  </p>
                  <p class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                    Immediately disable mobile access for this collector
                  </p>
                </div>
                <button
                  type="button"
                  class="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors group"
                  @click="handleSuspend"
                >
                  <ShieldAlert class="w-3.5 h-3.5" />
                  <span class="text-[10px] font-black uppercase tracking-[0.2em]">Suspend Access</span>
                </button>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- Inline Edit Actions -->
    <StickyFormActions v-if="isEditing || hasAssignmentChanges">
      <template #left>
        <div class="flex items-center gap-3">
          <div
            v-if="updateMutation.isPending.value"
            class="flex items-center gap-2"
          >
            <div class="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
            <span class="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Syncing cloud profile...</span>
          </div>
          <span
            v-else
            class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic"
          >You have unsaved identity changes</span>
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
        Save Profile
      </AppButton>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollector, useUpdateCollector } from '../composables/useCollectors'
import { useEvents } from '@/modules/events/composables/useEvents'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { branchesService } from '@/modules/tenants/services/branchesService'
import { useToastStore } from '@/shared/stores/useToastStore'
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import { 
  Download,
  Plus,
  History,
  Users,
  Settings,
  Pencil,
  ShieldAlert,
  Calendar,
  Check,
  Search,
  SearchX,
  Target
} from 'lucide-vue-next'
import AssignmentListRow from '@/shared/components/rows/AssignmentListRow.vue'
import EditorialHeader from '@/shared/components/headers/EditorialHeader.vue'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'

const route = useRoute()
const router = useRouter()
const collectorId = computed(() => route.params.id as string)
const query = useCollector(collectorId.value)
const collector = computed(() => query.data.value)
const updateMutation = useUpdateCollector()
const toast = useToastStore()

const eventQuery = useEvents()
const availableEvents = computed(() => eventQuery.data.value ?? [])
const allFunds = ref<RecipientFund[]>([])
const isLoadingBranches = ref(true)
const branchOptions = ref([])

onMounted(async () => {
  try {
    const [fundsData, branchesData] = await Promise.all([
      recipientFundsService.list(),
      branchesService.list()
    ])
    allFunds.value = fundsData
    branchOptions.value = branchesData.map(b => ({ label: b.name, value: b.id }))
  } catch (err) {
    console.error('Failed to load dependency records:', err)
  } finally {
    isLoadingBranches.value = false
  }
})

const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: 'Overview', icon: 'User' },
  { key: 'assignments', label: 'Assignments', icon: 'Target' },
  { key: 'history', label: 'History', icon: 'History' },
  { key: 'settings', label: 'Settings', icon: 'Settings' },
]

const overviewSections = [
  { id: 'section-identity', title: 'Identity', subtitle: 'Step 01' },
  { id: 'section-assignments', title: 'Assignments', subtitle: 'Step 02' },
  { id: 'section-metrics', title: 'Intelligence', subtitle: 'Step 03' },
]

const isEditing = ref(route.query.edit === 'true')
const form = ref<any>(null)
const initialEventIds = ref<string[]>([])
const initialFundIds = ref<string[]>([])
const searchQuery = ref('')

watchEffect(() => {
  if (collector.value && !form.value) {
    resetForm()
    initialEventIds.value = [...(collector.value.eventIds || [])]
    initialFundIds.value = [...((collector.value as any).fundIds || [])]
  }
})

const hasAssignmentChanges = computed(() => {
  if (!form.value || !collector.value) return false
  const currentEvents = [...(form.value.eventIds || [])].sort()
  const initialEvents = [...initialEventIds.value].sort()
  const currentFunds = [...(form.value.fundIds || [])].sort()
  const initialFunds = [...initialFundIds.value].sort()
  
  return JSON.stringify(currentEvents) !== JSON.stringify(initialEvents) ||
         JSON.stringify(currentFunds) !== JSON.stringify(initialFunds)
})

function resetForm() {
  if (!collector.value) return
  form.value = {
    name: collector.value.name,
    email: collector.value.email,
    phoneNumber: collector.value.phoneNumber || '',
    status: collector.value.status,
    branchId: (collector.value as any).branchId || null,
    eventIds: [...(collector.value.eventIds || [])],
    fundIds: [...((collector.value as any).fundIds || [])]
  }
}

function startEditing() {
  resetForm()
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  resetForm()
  router.replace({ query: { ...route.query, edit: undefined } })
}

function isEventAssigned(id: string) {
  return form.value?.eventIds.includes(id)
}

function isFundAssigned(id: string) {
  return form.value?.fundIds.includes(id)
}

function toggleEventAssignment(id: string) {
  if (!isEditing.value) startEditing()
  
  const index = form.value.eventIds.indexOf(id)
  if (index > -1) {
    form.value.eventIds.splice(index, 1)
  } else {
    form.value.eventIds.push(id)
    // Remove all funds belonging to this event from fundIds to keep it clean (Event access is super)
    const eventFunds = allFunds.value.filter(f => f.eventId === id).map(f => f.id)
    form.value.fundIds = form.value.fundIds.filter((fid: string) => !eventFunds.includes(fid))
  }
}

function toggleFundAssignment(id: string) {
  if (!isEditing.value) startEditing()
  
  const index = form.value.fundIds.indexOf(id)
  if (index > -1) {
    form.value.fundIds.splice(index, 1)
  } else {
    form.value.fundIds.push(id)
  }
}

function getFundsForEvent(eventId: string) {
  return allFunds.value.filter(f => f.eventId === eventId)
}

const groupedAssignedItems = computed(() => {
  if (!form.value) return []
  const groups: any[] = []

  // 1. Group Events
  form.value.eventIds.forEach((id: string) => {
    const event = availableEvents.value.find(e => e.id === id)
    if (event) {
      groups.push({
        eventId: event.id,
        event: {
          type: 'event',
          id: event.id,
          uniqueKey: `event-${event.id}`,
          title: event.title,
          subtitle: formatDate(event.eventDate),
          badge: 'Full Campaign',
          imageUrl: event.displayImageUrl
        },
        funds: [] // No individual funds shown if event is fully assigned
      })
    }
  })

  // 2. Group Funds (only if parent event is not assigned)
  form.value.fundIds.forEach((id: string) => {
    const fund = allFunds.value.find(f => f.id === id)
    if (fund && !form.value.eventIds.includes(fund.eventId)) {
      let group = groups.find(g => g.eventId === fund.eventId)
      if (!group) {
        const event = availableEvents.value.find(e => e.id === fund.eventId)
        group = {
          eventId: fund.eventId,
          event: {
            type: 'event',
            id: fund.eventId,
            uniqueKey: `event-header-${fund.eventId}`,
            title: event?.title || 'Unknown Campaign',
            subtitle: event ? formatDate(event.eventDate) : '',
            badge: 'Partial Scope',
            imageUrl: event?.displayImageUrl,
            isHeader: true // This will style it as a header but not actionable
          },
          funds: []
        }
        groups.push(group)
      }
      group.funds.push({
        type: 'fund',
        id: fund.id,
        uniqueKey: `fund-${fund.id}`,
        title: fund.name,
        subtitle: `Authorized Scope`,
        badge: 'Fund',
        isSubItem: true
      })
    }
  })

  return groups
})

const groupedSearchResults = computed(() => {
  if (!searchQuery.value.trim() || !form.value) return []
  const query = searchQuery.value.toLowerCase()
  const groups: any[] = []

  // Iterate over all events and see if they OR their funds match
  availableEvents.value.forEach(e => {
    // Skip if event is already fully assigned
    if (form.value.eventIds.includes(e.id)) return

    const eventMatches = e.title.toLowerCase().includes(query)
    const matchingFunds = allFunds.value.filter(f => 
      f.eventId === e.id && 
      f.name.toLowerCase().includes(query) && 
      !form.value.fundIds.includes(f.id)
    )

    if (eventMatches || matchingFunds.length > 0) {
      // Include all unassigned funds if the event matches, 
      // or only the matching unassigned funds if the event doesn't match
      const fundsToInclude = eventMatches 
        ? allFunds.value.filter(f => f.eventId === e.id && !form.value.fundIds.includes(f.id))
        : matchingFunds

      groups.push({
        eventId: e.id,
        event: {
          type: 'event',
          id: e.id,
          uniqueKey: `search-event-${e.id}`,
          title: e.title,
          subtitle: formatDate(e.eventDate),
          badge: 'Campaign',
          imageUrl: e.displayImageUrl
        },
        funds: fundsToInclude.map(f => ({
          type: 'fund',
          id: f.id,
          uniqueKey: `search-fund-${f.id}`,
          title: f.name,
          subtitle: `Authorized via ${e.title}`,
          badge: 'Fund',
          isSubItem: true
        }))
      })
    }
  })

  return groups.slice(0, 10)
})

function handleSearchAction(item: any) {
  if (item.type === 'event') {
    toggleEventAssignment(item.id)
  } else {
    toggleFundAssignment(item.id)
  }
  searchQuery.value = ''
}

function handleRemoveAction(item: any) {
  if (item.type === 'event') {
    toggleEventAssignment(item.id)
  } else {
    toggleFundAssignment(item.id)
  }
}

async function handleSave() {
  try {
    await updateMutation.mutateAsync({
      id: collectorId.value,
      payload: form.value
    })
    isEditing.value = false
    toast.success('Staff profile synchronized successfully')
    query.refetch()
    router.replace({ query: { ...route.query, edit: undefined } })
  } catch (err) {
    toast.error('Failed to save changes')
  }
}

const collectorEvents = computed(() => {
  if (!collector.value) return []
  return availableEvents.value.filter(e => collector.value!.eventIds.includes(e.id))
})

function exportPerformance() {
  toast.info('Synthesizing performance log...')
}

function handleSuspend() {
  toast.info('Suspending staff access...')
}
</script>
