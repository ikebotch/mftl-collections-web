<template>
  <div
    v-if="query.isLoading.value"
    class="py-32"
  >
    <LoadingState text="Loading event details..." />
  </div>
  <ErrorState
    v-else-if="query.isError.value"
    title="Failed to load event"
    :message="query.error.value?.message ?? 'Sync failed'"
    show-retry
    @retry="query.refetch"
  />
  <div
    v-else-if="event"
    class="space-y-10 pb-20"
  >
    <!-- 1. Page Header (Pixel Standard) -->
    <DetailPageHeader
      :title="event.title"
      description="Operational management, fund allocation, and contribution auditing."
      back-to="/admin/events"
      back-label="Events List"
      :image-url="event.displayImageUrl"
    >
      <template #status>
        <div class="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] shrink-0">
          <div 
            class="w-1.5 h-1.5 rounded-full"
            :class="event.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
          />
          <span class="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">
            {{ event.isActive ? 'Active' : 'Draft' }}
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="secondary"
            size="sm"
            class="bg-white border-slate-100 px-6 whitespace-nowrap"
            @click="previewStorefront"
          >
            <template #icon><ExternalLink class="w-3.5 h-3.5 mr-2.5 text-slate-400" /></template>
            Preview
          </AppButton>
          
          <AppButton
            variant="secondary"
            size="sm"
            class="bg-white border-slate-100 px-6 whitespace-nowrap"
            @click="copyPublicLink"
          >
            <template #icon><Link2 class="w-3.5 h-3.5 mr-2.5 text-slate-400" /></template>
            Copy
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
            title="Overview Sections"
          >
            <!-- Event Identity Section -->
            <AppCard 
              id="section-detail"
              class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm"
            >
              <div class="flex items-center justify-between mb-16">
                <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80">
                  Event Identity
                </h3>
                <button
                  v-if="!isEditing"
                  type="button"
                  class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                  @click="startEditing"
                >
                  <Pencil class="w-3.5 h-3.5" />
                  <span class="text-[10px] font-black uppercase tracking-[0.2em]">Edit</span>
                </button>
              </div>

              <div
                v-if="!isEditing"
                class="space-y-16"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
                  <!-- Campaign Title -->
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Campaign Title
                    </p>
                    <p class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                      {{ event.title }}
                    </p>
                  </div>
                  
                  <!-- Public Path -->
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Public Path
                    </p>
                    <p class="text-[15px] font-black text-slate-900 tracking-tighter italic leading-none">
                      /give/{{ event.slug }}
                    </p>
                  </div>

                  <!-- Operational Narrative (Full Width) -->
                  <div class="md:col-span-2 space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Operational Narrative
                    </p>
                    <p class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-relaxed max-w-3xl">
                      {{ event.description || 'Zero operational narrative established.' }}
                    </p>
                  </div>

                  <!-- Launch Date -->
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      Launch Date
                    </p>
                    <p class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                      {{ formatDate(event.eventDate) }}
                    </p>
                  </div>

                  <!-- System Status -->
                  <div class="space-y-4">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      System Status
                    </p>
                    <div class="flex items-center gap-2.5">
                      <div 
                        class="w-1.5 h-1.5 rounded-full"
                        :class="event.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
                      />
                      <span class="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                        {{ event.isActive ? 'Active / Visible' : 'Inactive / Draft' }}
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
                    v-model="form!.title"
                    label="Campaign Title"
                    placeholder="Event title"
                    required
                  />
                  <AppInput
                    v-model="form!.slug"
                    label="Public Slug"
                    placeholder="url-slug"
                    required
                  >
                    <template #prefix>
                      <span class="text-slate-400">/give/</span>
                    </template>
                  </AppInput>
                </div>
                <AppTextarea
                  v-model="form!.description"
                  label="Operational Narrative"
                  placeholder="Event purpose..."
                  :rows="4"
                />
                <div class="grid grid-cols-2 gap-12">
                  <AppInput
                    v-model="form!.eventDate as string"
                    type="date"
                    label="Launch Date"
                  />
                  <AppSelect
                    v-model="form!.isActive"
                    label="Deployment Status"
                    :options="[
                      { label: 'Active', value: true },
                      { label: 'Inactive / Draft', value: false },
                      { label: 'Archive / Delete', value: false }
                    ]"
                  />
                </div>
              </div>
            </AppCard>

            <!-- Recipient Funds Section (Hybrid Concept) -->
            <AppCard 
              id="section-funds"
              class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm"
            >
              <div class="flex items-center justify-between mb-12">
                <div class="space-y-1">
                  <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80">
                    Step 02
                  </h3>
                  <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase">
                    Recipient Funds
                  </h2>
                </div>
                <button
                  type="button"
                  class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                  @click="handleAddFundClick"
                >
                  <Plus class="w-4 h-4" />
                  <span class="text-[10px] font-black uppercase tracking-[0.2em]">Add Fund</span>
                </button>
              </div>

              <div class="space-y-16">
                <!-- 1. Pending Additions (Inline Style) -->
                <div v-if="newFunds.length > 0" class="space-y-16">
                  <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600">Pending Additions</h4>
                  <div 
                    v-for="(fund, index) in newFunds" 
                    :key="index"
                    class="space-y-10 relative group pb-16 border-b border-slate-100 last:border-0"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <AppInput
                        v-model="fund.name"
                        label="Fund Name"
                        placeholder="e.g. Clean Water wells"
                        required
                      />
                      <AppInput
                        v-model="fund.targetAmount"
                        type="number"
                        label="Fund Target"
                        placeholder="0.00"
                        required
                      >
                        <template #prefix>
                          <span class="text-slate-400 font-bold uppercase tracking-tighter">GHS</span>
                        </template>
                      </AppInput>
                    </div>
                    <AppInput
                      v-model="fund.description"
                      label="Description"
                      placeholder="Short summary of this fund's purpose..."
                    />
                    <div class="flex items-center justify-between pt-4">
                      <div class="flex items-center gap-3">
                        <AppSwitch v-model="fund.isActive" />
                        <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Fund Active</span>
                      </div>
                      <button 
                        type="button"
                        class="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        @click="removeNewFund(index)"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 2. Existing Operational Funds (View Style - Always Visible) -->
                <div class="space-y-8">
                  <div v-if="newFunds.length > 0" class="pt-8 border-t border-slate-100">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Operational Records</h4>
                  </div>
                  <EventRecipientFundsList 
                    :event-id="event.id" 
                  />
                </div>
              </div>
            </AppCard>

            <!-- Event Images (Modern) -->
            <AppCard 
              id="section-images"
              class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm"
            >
              <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 mb-16">
                Media & Branding
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-16">
                <ModernImageInput 
                  v-model="displayImageUrlProxy"
                  label="System Image"
                  :icon="ImageIcon"
                />
                <ModernImageInput 
                  v-model="receiptLogoUrlProxy"
                  label="Receipt Logo"
                  :icon="Printer"
                />
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <!-- Other Tabs -->
        <div v-else-if="activeTab === 'funds'" class="space-y-12">
          <div class="flex justify-between items-center mb-12">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80">Recipient Funds</h3>
            <RouterLink
              :to="`/admin/funds/new?eventId=${event.id}`"
              class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
            >
              <Plus class="w-4 h-4" />
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">Add Fund</span>
            </RouterLink>
          </div>
          <EventRecipientFundsList :event-id="event.id" />
        </div>

        <div v-else-if="activeTab === 'collectors'" class="space-y-12">
          <div class="flex justify-between items-center mb-12">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80">Assigned Field Staff</h3>
            <button
              type="button"
              class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
              @click="router.push('/admin/collectors/new')"
            >
              <Plus class="w-4 h-4" />
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">Onboard Collector</span>
            </button>
          </div>
          <EventCollectorsList :event-id="event.id" />
        </div>

        <div v-else-if="activeTab === 'activity'" class="space-y-12">
          <AppCard class="!p-16 max-w-4xl border-slate-100">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 mb-16">Audit Stream</h3>
            <AuditTimeline :events="auditItems" />
          </AppCard>
        </div>

        <div v-else-if="activeTab === 'settings'" class="space-y-16">
          <AppCard class="!p-16 max-w-4xl border-slate-100">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 mb-16">Operational Settings</h3>
            <div class="space-y-12">
              <div class="flex items-center justify-between p-12 bg-slate-50/50 border border-slate-100">
                <div class="space-y-3">
                  <p class="text-[13px] font-black text-slate-900 tracking-tighter uppercase">Collection Visibility</p>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toggle whether this event is visible on the public storefront</p>
                </div>
                <AppSelect v-model="visibilityProxy" :options="[{ label: 'Public', value: true }, { label: 'Hidden / Draft', value: false }]" class="w-48" @update:model-value="saveVisibility" />
              </div>
              <div class="flex items-center justify-between p-12 bg-rose-50/30 border border-rose-100">
                <div class="space-y-3">
                  <p class="text-[13px] font-black text-rose-900 tracking-tighter uppercase">Archive Campaign</p>
                  <p class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Permanently remove this campaign from the active operational stream</p>
                </div>
                <button
                  type="button"
                  class="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors group"
                  @click="handleArchive"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                  <span class="text-[10px] font-black uppercase tracking-[0.2em]">Delete Campaign</span>
                </button>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- Inline Edit Actions -->
    <StickyFormActions v-if="isEditing || hasMediaChanges || newFunds.length > 0">
      <template #left>
        <div class="flex items-center gap-3">
          <div v-if="updateMutation.isPending.value" class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
            <span class="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Saving changes...</span>
          </div>
          <span v-else class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">You have unsaved changes</span>
        </div>
      </template>
      <AppButton variant="outline" class="bg-transparent border-slate-200 px-10" @click="cancelEditing">Cancel</AppButton>
      <AppButton variant="primary" class="px-12" :loading="updateMutation.isPending.value" @click="handleSave">Save Changes</AppButton>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent, useUpdateEvent } from '../composables/useEvents'
import { useToastStore } from '@/shared/stores/useToastStore'
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import AuditTimeline from '@/shared/components/feedback/AuditTimeline.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import EventRecipientFundsList from '../components/EventRecipientFundsList.vue'
import EventCollectorsList from '../components/EventCollectorsList.vue'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import ModernImageInput from '@/shared/components/forms/ModernImageInput.vue'
import { formatDate } from '@/core/formatting/formatters'
import { 
  ExternalLink, 
  Link2,
  Plus,
  Image as ImageIcon,
  Printer,
  History,
  LayoutDashboard,
  Users,
  Settings,
  Pencil,
  Trash2
} from 'lucide-vue-next'
import type { UpdateEventInput } from '../types/event'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => route.params.id as string)
const query = useEvent(eventId.value)
const event = computed(() => query.data.value)
const updateMutation = useUpdateEvent()
const toast = useToastStore()

const activeTab = ref('overview')
const visibilityProxy = ref(false)

const tabs = [
  { key: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { key: 'funds', label: 'Recipient Funds', icon: 'Target' },
  { key: 'collectors', label: 'Collectors', icon: 'Users' },
  { key: 'activity', label: 'Activity / Audit', icon: 'History' },
  { key: 'settings', label: 'Settings', icon: 'Settings' },
]

const overviewSections = [
  { id: 'section-detail', title: 'Identity', subtitle: 'Step 01' },
  { id: 'section-funds', title: 'Funds', subtitle: 'Step 02' },
  { id: 'section-images', title: 'Branding', subtitle: 'Step 03' },
]

const isEditing = ref(route.query.edit === 'true')
const form = ref<UpdateEventInput | null>(null)
const newFunds = ref<any[]>([])
const isLoadingFunds = ref(false)

const displayImageUrlProxy = ref('')
const receiptLogoUrlProxy = ref('')

watchEffect(() => {
  if (event.value) {
    if (!form.value) resetForm()
    displayImageUrlProxy.value = event.value.displayImageUrl || ''
    receiptLogoUrlProxy.value = event.value.receiptLogoUrl || ''
    visibilityProxy.value = event.value.isActive
  }
})

function addNewFund() {
  newFunds.value.unshift({
    name: '',
    description: '',
    targetAmount: 0,
    isActive: true
  })
}

function removeNewFund(index: number) {
  newFunds.value.splice(index, 1)
}

async function handleAddFundClick() {
  addNewFund()
}

// Removed the loose watchEffect for fund population as it is now handled deterministically in startEditing

const hasMediaChanges = computed(() => {
  if (!event.value) return false
  return (
    displayImageUrlProxy.value !== (event.value.displayImageUrl || '') ||
    receiptLogoUrlProxy.value !== (event.value.receiptLogoUrl || '')
  )
})

function resetForm() {
  if (!event.value) return
  form.value = {
    title: event.value.title,
    description: event.value.description,
    eventDate: event.value.eventDate ? new Date(event.value.eventDate).toISOString().split('T')[0] : '',
    isActive: event.value.isActive,
    slug: event.value.slug,
    displayImageUrl: event.value.displayImageUrl,
    receiptLogoUrl: event.value.receiptLogoUrl
  }
}

async function startEditing() {
  resetForm()
  isEditing.value = true
  
  // Deterministically populate funds for inline editing
  if (event.value) {
    isLoadingFunds.value = true
    try {
      const funds = await recipientFundsService.listByEvent(event.value.id)
      editingFunds.value = funds.map(f => ({
        id: f.id,
        name: f.name,
        description: f.description,
        targetAmount: f.targetAmount,
        isActive: true
      }))
    } catch (err) {
      console.error('Failed to sync funds for editing:', err)
      editingFunds.value = []
    } finally {
      isLoadingFunds.value = false
    }
  }
}

function cancelEditing() {
  isEditing.value = false
  newFunds.value = []
  displayImageUrlProxy.value = event.value?.displayImageUrl || ''
  receiptLogoUrlProxy.value = event.value?.receiptLogoUrl || ''
  router.replace({ query: { ...route.query, edit: undefined } })
}

async function handleSave() {
  const payload = isEditing.value ? { ...form.value } : {
    title: event.value?.title,
    description: event.value?.description,
    eventDate: event.value?.eventDate,
    isActive: event.value?.isActive,
    slug: event.value?.slug,
    displayImageUrl: displayImageUrlProxy.value,
    receiptLogoUrl: receiptLogoUrlProxy.value
  }

  if (!isEditing.value) {
    payload.displayImageUrl = displayImageUrlProxy.value
    payload.receiptLogoUrl = receiptLogoUrlProxy.value
  }

  try {
    // 1. Update Event Identity
    await updateMutation.mutateAsync({
      id: eventId.value,
      payload: payload as UpdateEventInput
    })

    // 2. Batch Create Pending Funds
    if (newFunds.value.length > 0) {
      await Promise.all(
        newFunds.value.map(fund => 
          recipientFundsService.create({
            eventId: eventId.value,
            name: fund.name,
            description: fund.description || '',
            targetAmount: fund.targetAmount
          })
        )
      )
    }

    isEditing.value = false
    newFunds.value = []
    router.replace({ query: { ...route.query, edit: undefined } })
    toast.success('Campaign synchronized successfully')
    query.refetch()
  } catch (err) {
    console.error('Failed to update event:', err)
    toast.error('Failed to save changes')
  }
}

async function saveVisibility(val: boolean) {
  if (!event.value) return
  
  try {
    await updateMutation.mutateAsync({
      id: eventId.value,
      payload: {
        ...event.value,
        isActive: val
      } as UpdateEventInput
    })
    toast.success(`Event visibility updated to ${val ? 'Public' : 'Hidden'}`)
  } catch (err) {
    console.error('Failed to update visibility:', err)
    toast.error('Failed to update settings')
    visibilityProxy.value = event.value.isActive
  }
}

const auditItems = computed(() => [
  {
    id: '1',
    type: 'creation' as const,
    content: 'Event Created',
    target: event.value?.title || '',
    description: `Event initialized by system`,
    date: formatDate(event.value?.eventDate),
    datetime: event.value?.eventDate || new Date().toISOString()
  }
])

function copyPublicLink() {
  if (!event.value) return
  const url = `${window.location.origin}/give/${event.value.slug}`
  navigator.clipboard.writeText(url)
  toast.success('Public link copied to clipboard')
}

function previewStorefront() {
  if (!event.value) return
  const url = `${window.location.origin}/give/${event.value.slug}`
  window.open(url, '_blank')
}

function handleArchive() {
  toast.info('Archiving event...')
}
</script>
