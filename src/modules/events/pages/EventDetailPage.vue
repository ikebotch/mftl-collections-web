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
    <!-- Page Header -->
    <DetailPageHeader
      :title="`${event.title} ${event.id.slice(0, 8)}`"
      description="Operational management, fund allocation, and contribution auditing."
      back-to="/admin/events"
      back-label="Events List"
      :image-url="event.displayImageUrl"
    >
      <template #status>
        <div class="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-100 shadow-sm shrink-0">
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
        <div class="flex items-center gap-2">
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

          <!-- Icon Only Actions -->
          <div class="flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-100 shrink-0">
            <AppButton
              variant="ghost"
              size="sm"
              class="w-10 p-0 text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              title="Manage Recipient Funds"
              @click="activeTab = 'funds'"
            >
              <Target class="w-4 h-4" />
            </AppButton>
            <AppButton
              variant="ghost"
              size="sm"
              class="w-10 p-0 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Event Analytics"
              @click="router.push(`/admin/events/${event.id}/analytics`)"
            >
              <BarChart2 class="w-4 h-4" />
            </AppButton>
            <AppButton
              variant="ghost"
              size="sm"
              class="w-10 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Archive Event"
              @click="handleArchive"
            >
              <Trash2 class="w-4 h-4" />
            </AppButton>
          </div>
        </div>
      </template>
    </DetailPageHeader>

    <div class="space-y-8">
      <DetailTabs
        v-model="activeTab"
        :tabs="tabs"
      />

      <div class="min-h-[400px]">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'">
          <AdminWizardLayout 
            :sections="overviewSections" 
            title="Overview Sections"
          >
            <!-- Event Details -->
            <AppCard 
              id="section-detail"
              class="!p-10 scroll-mt-10 border-slate-200"
            >
              <div class="flex items-center justify-between mb-10">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Event Detail
                </h3>
                <AppButton
                  v-if="!isEditing"
                  variant="secondary"
                  size="xs"
                  class="bg-transparent border-slate-200"
                  @click="startEditing"
                >
                  Edit Details
                </AppButton>
              </div>

              <div
                v-if="!isEditing"
                class="space-y-10"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="space-y-1.5">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Campaign Title
                    </p>
                    <p class="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">
                      {{ event.title }}
                    </p>
                  </div>
                  <div class="space-y-1.5">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Public Path
                    </p>
                    <p class="text-lg font-black text-slate-900 tracking-tight leading-none italic underline decoration-slate-200">
                      /give/{{ event.slug }}
                    </p>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    Operational Description
                  </p>
                  <p class="text-sm font-medium text-slate-600 leading-relaxed max-w-2xl">
                    {{ event.description || 'No description provided.' }}
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="space-y-1.5">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Launch Date
                    </p>
                    <p class="text-sm font-black text-slate-900 uppercase">
                      {{ formatDate(event.eventDate) }}
                    </p>
                  </div>
                  <div class="space-y-1.5">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Administrative Status
                    </p>
                    <div class="pt-1 flex items-center gap-2">
                      <div 
                        class="w-1.5 h-1.5 rounded-full"
                        :class="event.isActive ? 'bg-emerald-500' : 'bg-slate-300'"
                      />
                      <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                        {{ event.isActive ? 'Active / Visible' : 'Inactive / Draft' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit Mode -->
              <div
                v-else
                class="space-y-8"
              >
                <div class="grid md:grid-cols-2 gap-8">
                  <AppInput
                    v-model="form!.title"
                    label="Title"
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
                  id="event-description"
                  v-model="form!.description"
                  label="Description"
                  placeholder="Event purpose..."
                  :rows="4"
                />
                <div class="grid grid-cols-2 gap-8">
                  <AppInput
                    v-model="form!.eventDate as string"
                    type="date"
                    label="Start Date"
                  />
                  <AppSelect
                    v-model="form!.isActive"
                    label="Status"
                    :options="[
                      { label: 'Active', value: true },
                      { label: 'Inactive / Draft', value: false },
                      { label: 'Archive / Delete', value: false }
                    ]"
                  />
                </div>
              </div>
            </AppCard>

            <!-- Recipient Funds -->
            <AppCard 
              id="section-funds"
              class="!p-10 scroll-mt-10 border-slate-200"
            >
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Recipient Funds
                </h3>
                <AppButton
                  variant="secondary"
                  size="xs"
                  class="bg-transparent border-slate-200"
                  @click="router.push(`/admin/events/${event.id}/recipient-funds/new`)"
                >
                  <Plus class="w-3 h-3 mr-2" /> Add Fund
                </AppButton>
              </div>
              <EventRecipientFundsList :event-id="event.id" />
            </AppCard>

            <!-- Event Images (Modern) -->
            <AppCard 
              id="section-images"
              class="!p-10 scroll-mt-10 border-slate-200"
            >
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
                Media & Branding
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <ModernImageInput 
                  v-model="displayImageUrlProxy"
                  label="System / Display Image"
                  :icon="ImageIcon"
                />
                <ModernImageInput 
                  v-model="receiptLogoUrlProxy"
                  label="Receipt / POS Logo"
                  :icon="Printer"
                />
              </div>
            </AppCard>
          </AdminWizardLayout>
        </div>

        <!-- Recipient Funds Tab -->
        <div
          v-else-if="activeTab === 'funds'"
          class="space-y-6"
        >
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Assigned Recipient Funds
            </h3>
            <AppButton
              variant="primary"
              @click="router.push(`/admin/events/${event.id}/recipient-funds/new`)"
            >
              <Plus class="w-4 h-4 mr-2" />
              Add Fund
            </AppButton>
          </div>
          <EventRecipientFundsList :event-id="event.id" />
        </div>

        <!-- Collectors Tab -->
        <div
          v-else-if="activeTab === 'collectors'"
          class="space-y-8"
        >
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Assigned Field Staff
            </h3>
            <AppButton
              variant="primary"
              @click="router.push('/admin/collectors/new')"
            >
              <Plus class="w-4 h-4 mr-2" />
              Onboard Collector
            </AppButton>
          </div>
          <EventCollectorsList :event-id="event.id" />
        </div>

        <!-- Activity Tab -->
        <div
          v-else-if="activeTab === 'activity'"
          class="space-y-8"
        >
          <AppCard class="!p-10 max-w-4xl border-slate-200">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
              Event Audit Log
            </h3>
            <AuditTimeline :events="auditItems" />
          </AppCard>
        </div>

        <!-- Settings Tab -->
        <div
          v-else-if="activeTab === 'settings'"
          class="space-y-10"
        >
          <AppCard class="!p-10 max-w-4xl border-slate-200">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
              Operational Settings
            </h3>
            <div class="space-y-8">
              <div class="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-200">
                <div class="space-y-1.5">
                  <p class="text-sm font-black text-slate-900 tracking-tight leading-none uppercase">
                    Collection Visibility
                  </p>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Toggle whether this event is visible on the public storefront
                  </p>
                </div>
                <AppSelect
                  v-model="visibilityProxy"
                  :options="[
                    { label: 'Public', value: true },
                    { label: 'Hidden / Draft', value: false }
                  ]"
                  class="w-48"
                  @update:model-value="saveVisibility"
                />
              </div>
              
              <div class="flex items-center justify-between p-8 bg-rose-50/30 border border-rose-100">
                <div class="space-y-1.5">
                  <p class="text-sm font-black text-rose-900 tracking-tight leading-none uppercase">
                    Archive Event
                  </p>
                  <p class="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-1">
                    Permanently remove this event and all associated assignments from the active stream
                  </p>
                </div>
                <AppButton variant="ghost" class="text-rose-600 hover:bg-rose-100 border border-transparent hover:border-rose-200 px-6 font-black uppercase tracking-widest text-[10px]">
                  Delete Event
                </AppButton>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- Inline Edit Actions -->
    <StickyFormActions v-if="isEditing || hasMediaChanges">
      <template #left>
        <div class="flex items-center gap-3">
          <div
            v-if="updateMutation.isPending.value"
            class="flex items-center gap-2"
          >
            <div class="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
            <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Saving changes...</span>
          </div>
          <span
            v-else
            class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic"
          >You have unsaved changes</span>
        </div>
      </template>
      <AppButton
        variant="outline"
        class="bg-transparent border-slate-200"
        @click="cancelEditing"
      >
        Cancel
      </AppButton>
      <AppButton
        variant="primary"
        class="px-10"
        :loading="updateMutation.isPending.value"
        @click="handleSave"
      >
        Save Changes
      </AppButton>
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
  Target, 
  ExternalLink, 
  Link2,
  Plus,
  Image as ImageIcon,
  Printer,
  History,
  LayoutDashboard,
  Users,
  Settings,
  Trash2,
  BarChart2
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
  { id: 'section-detail', title: 'Event Detail', subtitle: 'Identity & Status' },
  { id: 'section-funds', title: 'Recipient Funds', subtitle: 'Fund Management' },
  { id: 'section-images', title: 'Media & Branding', subtitle: 'Images & Logos' },
]

const isEditing = ref(route.query.edit === 'true')
const form = ref<UpdateEventInput | null>(null)

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

function startEditing() {
  resetForm()
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
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
    await updateMutation.mutateAsync({
      id: eventId.value,
      payload: payload as UpdateEventInput
    })
    isEditing.value = false
    router.replace({ query: { ...route.query, edit: undefined } })
    toast.success('Event details updated successfully')
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
