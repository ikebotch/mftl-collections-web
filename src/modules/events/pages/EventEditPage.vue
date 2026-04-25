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
  <form
    v-else-if="form"
    class="space-y-10"
    @submit.prevent="handleSave"
  >
    <DetailPageHeader
      :title="`Edit ${event?.title}`"
      description="Efficiently manage event details, visibility, and core settings."
      :back-to="{ name: 'admin-events-detail', params: { id: eventId } }"
    >
      <template #meta>
        <div class="flex items-center gap-4">
          <StatusBadge
            :status="form.isActive ? 'active' : 'draft'"
            :variant="form.isActive ? 'success' : 'neutral'"
          />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Editing operational record
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="router.push({ name: 'admin-events-detail', params: { id: eventId } })"
          >
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            class="!rounded-xl shadow-premium"
            type="submit"
            :loading="updateMutation.isPending.value"
          >
            Save Changes
          </AppButton>
        </div>
      </template>
    </DetailPageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8 space-y-8">
        <!-- Core Details -->
        <AppCard class="!p-8 space-y-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            General Information
          </h3>
          <div class="space-y-6">
            <AppInput
              v-model="form.title"
              label="Event Title"
              placeholder="e.g. Community Health Drive 2024"
              required
            />
            <AppTextarea
              id="event-description"
              v-model="form.description"
              label="Description"
              placeholder="Provide a detailed operational summary of this event..."
              :rows="6"
            />
          </div>
        </AppCard>

        <!-- Visibility & Technical -->
        <AppCard class="!p-8 space-y-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Visibility & Technical
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppInput
              v-model="form.slug"
              label="Public Slug"
              placeholder="health-drive-2024"
              required
            >
              <template #prefix>
                <span class="text-slate-400">/give/</span>
              </template>
            </AppInput>
            <AppInput
              v-model="form!.eventDate as string"
              type="date"
              label="Event Date"
              required
            />
          </div>
        </AppCard>

        <!-- Event Media -->
        <AppCard class="!p-8 space-y-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Event Media
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">System/Display Image</label>
              <div class="aspect-video rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 relative group overflow-hidden border border-slate-100">
                <ImageIcon class="w-8 h-8" />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <AppButton variant="primary" size="sm" class="!rounded-lg text-[9px] font-black uppercase tracking-widest">Update Image</AppButton>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Receipt/POS Logo</label>
              <div class="aspect-video rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-200 relative group overflow-hidden">
                <Printer class="w-8 h-8" />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <AppButton variant="primary" size="sm" class="!rounded-lg text-[9px] font-black uppercase tracking-widest">Update Logo</AppButton>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <DetailSummaryCard 
          title="Campaign Status"
          :items="[]"
        >
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500">Enable Collections</span>
              <AppSwitch v-model="form.isActive" />
            </div>
            <p class="text-[10px] text-slate-400 italic leading-relaxed">
              When disabled, the public storefront link will show an "Ended" or "Offline" message.
            </p>
          </div>
        </DetailSummaryCard>

        <AppCard class="!p-6 border-slate-100 bg-slate-50/30">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
            Audit Metadata
          </h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Event ID</span>
              <span class="text-[9px] font-mono text-slate-500">{{ event?.id.split('-')[0] }}...</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Modified</span>
              <span class="text-[9px] font-black text-slate-900 tracking-tight">Today</span>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <StickyFormActions>
      <template #left>
        <span
          v-if="updateMutation.isPending.value"
          class="text-xs font-bold text-violet-600 animate-pulse"
        >
          Saving changes to cloud storage...
        </span>
      </template>
      <AppButton
        variant="outline"
        @click="router.push({ name: 'admin-events-detail', params: { id: eventId } })"
      >
        Discard
      </AppButton>
      <AppButton
        variant="primary"
        class="!rounded-xl shadow-premium"
        type="submit"
        :loading="updateMutation.isPending.value"
      >
        Save Changes
      </AppButton>
    </StickyFormActions>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent, useUpdateEvent } from '../composables/useEvents'
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import { Image as ImageIcon, Printer } from 'lucide-vue-next'
import type { UpdateEventInput } from '../types/event'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => route.params.id as string)

const query = useEvent(eventId.value)
const event = computed(() => query.data.value)

const updateMutation = useUpdateEvent()

const form = ref<UpdateEventInput | null>(null)

watchEffect(() => {
  if (event.value && !form.value) {
    form.value = {
      title: event.value.title,
      description: event.value.description,
      eventDate: event.value.eventDate ? new Date(event.value.eventDate).toISOString().split('T')[0] : '',
      isActive: event.value.status === 'active',
      slug: event.value.slug
    }
  }
})

async function handleSave() {
  if (!form.value) return
  
  try {
    await updateMutation.mutateAsync({
      id: eventId.value,
      payload: form.value
    })
    
    router.push({ name: 'admin-events-detail', params: { id: eventId.value } })
  } catch (err) {
    console.error('Failed to update event:', err)
  }
}
</script>
