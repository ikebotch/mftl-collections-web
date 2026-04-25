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
    <AdminPageHeader
      :title="event.title"
      description="Operational management, fund allocation, and contribution auditing."
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="activeTab = 'funds'"
          >
            <Target class="w-4 h-4 mr-2" />
            Manage Funds
          </AppButton>
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="previewStorefront"
          >
            <ExternalLink class="w-4 h-4 mr-2" />
            Preview Storefront
          </AppButton>
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="copyPublicLink"
          >
            <Link2 class="w-4 h-4 mr-2" />
            Copy Link
          </AppButton>
          <AppButton
            variant="ghost"
            class="!rounded-xl"
          >
            <MoreVertical class="w-4 h-4" />
          </AppButton>
        </div>
      </template>
    </AdminPageHeader>

    <div class="space-y-8">
      <DetailTabs
        v-model="activeTab"
        :tabs="tabs"
      />

      <div class="min-h-[400px]">
        <!-- Overview Tab -->
        <div
          v-if="activeTab === 'overview'"
          class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start"
        >
          <!-- Left Sidebar: Overview Sections -->
          <aside class="sticky top-10 space-y-8 hidden lg:block">
            <div class="space-y-6">
              <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                Overview Sections
              </h3>
              
              <nav class="relative">
                <!-- Connecting Line -->
                <div class="absolute left-[19px] top-4 bottom-4 w-[1px] bg-slate-100 z-0" />
                
                <ul class="space-y-4 relative z-10">
                  <li 
                    v-for="(section, index) in overviewSections" 
                    :key="section.id"
                  >
                    <button
                      class="w-full flex items-center gap-4 p-2 rounded-2xl transition-all duration-300 group text-left"
                      :class="activeSection === section.id ? 'bg-violet-50' : 'hover:bg-slate-50'"
                      @click="scrollToSection(section.id)"
                    >
                      <div 
                        class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300"
                        :class="activeSection === section.id 
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                          : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'"
                      >
                        {{ index + 1 }}
                      </div>
                      <div class="min-w-0">
                        <p 
                          class="text-xs font-black tracking-tight transition-colors duration-300"
                          :class="activeSection === section.id ? 'text-violet-600' : 'text-slate-900'"
                        >
                          {{ section.title }}
                        </p>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                          {{ section.subtitle }}
                        </p>
                      </div>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          <!-- Right Column: Stacked Cards -->
          <div class="flex flex-col gap-12">
            <!-- Event Details -->
            <AppCard 
              id="section-detail"
              class="!p-8 border-none shadow-soft bg-white relative scroll-mt-10"
            >
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Event Detail
                </h3>
                <AppButton
                  v-if="!isEditing"
                  variant="outline"
                  size="sm"
                  class="!rounded-lg !text-[10px] uppercase tracking-widest font-black"
                  @click="startEditing"
                >
                  Edit Details
                </AppButton>
              </div>

              <div
                v-if="!isEditing"
                class="space-y-8"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-1">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Title
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight">
                      {{ event.title }}
                    </p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Public Slug
                    </p>
                    <p class="text-sm font-bold text-violet-600 tracking-tight font-mono">
                      /give/{{ event.slug }}
                    </p>
                  </div>
                </div>

                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Description
                  </p>
                  <p class="text-sm font-medium text-slate-600 leading-relaxed">
                    {{ event.description || 'No description provided.' }}
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-1">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Start Date
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight">
                      {{ formatDate(event.eventDate) }}
                    </p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      End Date
                    </p>
                    <p class="text-sm font-black text-slate-900 tracking-tight">
                      31 May 2026
                    </p>
                  </div>
                </div>

                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </p>
                  <div class="pt-1">
                    <StatusBadge
                      :status="event.status"
                      :tone="event.status === 'active' ? 'success' : 'neutral'"
                    />
                  </div>
                </div>
              </div>

              <!-- Edit Mode -->
              <div
                v-else
                class="space-y-6"
              >
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
                <AppTextarea
                  id="event-description"
                  v-model="form!.description"
                  label="Description"
                  placeholder="Event purpose..."
                  :rows="4"
                />
                <div class="grid grid-cols-2 gap-6">
                  <AppInput
                    v-model="form!.eventDate as string"
                    type="date"
                    label="Start Date"
                  />
                  <AppInput
                    label="End Date"
                    type="date"
                    :model-value="'2026-05-31'"
                    disabled
                  />
                </div>
                <AppSelect
                  v-model="form!.isActive"
                  label="Status"
                  :options="[
                    { label: 'Active', value: true },
                    { label: 'Inactive / Draft', value: false }
                  ]"
                />
              </div>
            </AppCard>

            <!-- Recipient Funds -->
            <AppCard 
              id="section-funds"
              class="!p-8 border-none shadow-soft bg-white scroll-mt-10"
            >
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Recipient Funds
                </h3>
                <AppButton
                  variant="outline"
                  size="sm"
                  class="!rounded-lg !text-[10px] uppercase tracking-widest font-black"
                  @click="router.push(`/admin/events/${event.id}/recipient-funds/new`)"
                >
                  <Plus class="w-3 h-3 mr-2" /> Add Fund
                </AppButton>
              </div>
              <EventRecipientFundsList :event-id="event.id" />
            </AppCard>

            <!-- Event Images -->
            <AppCard 
              id="section-images"
              class="!p-8 border-none shadow-soft bg-white scroll-mt-10"
            >
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                Event Images
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <div
                    class="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group"
                  >
                    <img
                      v-if="event.displayImageUrl"
                      :src="event.displayImageUrl"
                      class="w-full h-full object-cover"
                    >
                    <div
                      v-else
                      class="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300"
                    >
                      <ImageIcon class="w-8 h-8" />
                    </div>
                  </div>
                  <div class="text-center space-y-3">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      System / Display Image
                    </p>
                    <AppButton
                      variant="outline"
                      size="sm"
                      class="w-full !text-[10px] uppercase tracking-widest font-black"
                      @click="startEditing"
                    >
                      Change Image
                    </AppButton>
                  </div>
                </div>

                <div class="space-y-4">
                  <div
                    class="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group"
                  >
                    <img
                      v-if="event.receiptLogoUrl"
                      :src="event.receiptLogoUrl"
                      class="w-full h-full object-contain p-4"
                    >
                    <div
                      v-else
                      class="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300"
                    >
                      <Printer class="w-8 h-8" />
                    </div>
                  </div>
                  <div class="text-center space-y-3">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Receipt / POS Image
                    </p>
                    <AppButton
                      variant="outline"
                      size="sm"
                      class="w-full !text-[10px] uppercase tracking-widest font-black"
                      @click="startEditing"
                    >
                      Change Image
                    </AppButton>
                  </div>
                </div>
              </div>

              <!-- Inline image editing inputs if editing -->
              <div
                v-if="isEditing"
                class="mt-8 pt-8 border-t border-slate-100 space-y-6"
              >
                <AppInput
                  v-model="form!.displayImageUrl"
                  label="Display Image URL"
                  placeholder="https://..."
                />
                <AppInput
                  v-model="form!.receiptLogoUrl"
                  label="Receipt Logo URL"
                  placeholder="https://..."
                />
              </div>
            </AppCard>

            <!-- Campaign Metadata -->
            <AppCard
              v-if="!isEditing"
              id="section-metadata"
              class="!p-8 border-none shadow-soft bg-white scroll-mt-10"
            >
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Campaign Metadata
              </h3>
              <div class="grid grid-cols-2 gap-8">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    ID
                  </p>
                  <p class="text-[11px] font-mono font-bold text-slate-900">
                    {{ event.id.slice(0, 8) }}...
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Created By
                  </p>
                  <p class="text-[11px] font-bold text-slate-900">
                    System Admin
                  </p>
                </div>
              </div>
            </AppCard>
          </div>
        </div>

        <!-- Recipient Funds Tab -->
        <div
          v-else-if="activeTab === 'funds'"
          class="space-y-6"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Assigned Recipient Funds
            </h3>
            <AppButton
              variant="primary"
              size="sm"
              class="!rounded-xl shadow-premium"
              @click="router.push(`/admin/events/${event.id}/recipient-funds/new`)"
            >
              <Plus class="w-4 h-4 mr-2" />
              Add Fund
            </AppButton>
          </div>
          <EventRecipientFundsList :event-id="event.id" />
        </div>

        <!-- Activity Tab -->
        <div
          v-else-if="activeTab === 'activity'"
          class="space-y-8"
        >
          <AppCard class="!p-8 max-w-3xl border-none shadow-soft bg-white">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
              Event Audit Log
            </h3>
            <AuditTimeline :events="auditItems" />
          </AppCard>
        </div>

        <!-- Default Placeholder for other tabs -->
        <div
          v-else
          class="bg-slate-50 border border-slate-100 rounded-[2rem] p-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-500"
        >
          <div class="w-16 h-16 rounded-[1.5rem] bg-white shadow-soft flex items-center justify-center text-slate-300 mb-6 border border-slate-50">
            <Zap class="w-8 h-8" />
          </div>
          <p class="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">
            Module Sync Pending
          </p>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] max-w-sm">
            The {{ activeTab }} interface is currently being wired to the live stream.
          </p>
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
            <div class="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span class="text-[10px] font-black text-violet-600 uppercase tracking-widest">Saving changes...</span>
          </div>
          <span
            v-else
            class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic"
          >Editing Event: {{ event.title }}</span>
        </div>
      </template>
      <AppButton
        variant="outline"
        class="!rounded-xl"
        @click="cancelEditing"
      >
        Cancel
      </AppButton>
      <AppButton
        variant="primary"
        class="!rounded-xl shadow-premium"
        :loading="updateMutation.isPending.value"
        @click="handleSave"
      >
        Save Changes
      </AppButton>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent, useUpdateEvent } from '../composables/useEvents'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import AuditTimeline from '@/shared/components/feedback/AuditTimeline.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import EventRecipientFundsList from '../components/EventRecipientFundsList.vue'
import { formatDate } from '@/core/formatting/formatters'
import { 
  Target, 
  ExternalLink, 
  Link2,
  Plus,
  MoreVertical,
  Zap,
  Image as ImageIcon,
  Printer
} from 'lucide-vue-next'
import type { UpdateEventInput } from '../types/event'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => route.params.id as string)
const query = useEvent(eventId.value)
const event = computed(() => query.data.value)
const updateMutation = useUpdateEvent()

const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'funds', label: 'Recipient Funds' },
  { key: 'contributions', label: 'Contributions' },
  { key: 'collectors', label: 'Collectors' },
  { key: 'activity', label: 'Activity / Audit' },
  { key: 'settings', label: 'Settings' },
]

// Overview Navigation Logic
const activeSection = ref('section-detail')
const overviewSections = [
  { id: 'section-detail', title: 'Event Detail', subtitle: 'Basic information and key details' },
  { id: 'section-funds', title: 'Recipient Funds', subtitle: 'Manage fund distribution' },
  { id: 'section-images', title: 'Event Images', subtitle: 'System and receipt images' },
  { id: 'section-metadata', title: 'Campaign Purpose', subtitle: 'Audit and tracking data' },
]

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        activeSection.value = entry.target.id
      }
    })
  }, { threshold: [0.5], rootMargin: '-80px 0px -50% 0px' })

  overviewSections.forEach(section => {
    const el = document.getElementById(section.id)
    if (el) observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}


// Inline Editing Logic
const isEditing = ref(route.query.edit === 'true')
const form = ref<UpdateEventInput | null>(null)

watchEffect(() => {
  if (event.value && !form.value) {
    resetForm()
  }
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
  // Remove edit query param without refreshing
  router.replace({ query: { ...route.query, edit: undefined } })
}

async function handleSave() {
  if (!form.value) return
  
  try {
    await updateMutation.mutateAsync({
      id: eventId.value,
      payload: form.value
    })
    isEditing.value = false
    router.replace({ query: { ...route.query, edit: undefined } })
  } catch (err) {
    console.error('Failed to update event:', err)
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
  },
  {
    id: '2',
    type: 'update' as const,
    content: 'Status Updated',
    target: event.value?.status || '',
    description: `Event status moved to operational state`,
    date: 'Today',
    datetime: new Date().toISOString()
  }
])

function copyPublicLink() {
  if (!event.value) return
  const url = `${window.location.origin}/give/${event.value.slug}`
  navigator.clipboard.writeText(url)
}

function previewStorefront() {
  if (!event.value) return
  window.open(`/give/${event.value.slug}`, '_blank')
}
</script>
