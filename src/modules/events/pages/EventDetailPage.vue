<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Event details"
      description="Review the event summary and move into recipient fund setup."
    >
      <template #actions>
        <AppButton @click="router.push(`/admin/events/${eventId}/recipient-funds`)">
          View recipient funds
        </AppButton>
      </template>
    </PageHeader>

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading event details…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load event"
      :message="query.error.value?.message ?? 'Try again later.'"
      show-retry
      @retry="query.refetch"
    />
    <div
      v-else-if="query.data.value"
      class="grid gap-6 lg:grid-cols-[2fr_1fr]"
    >
      <AppCard>
        <SectionHeader
          :title="query.data.value.title"
          :description="query.data.value.description"
        />
        <dl class="mt-6 grid gap-4 sm:grid-cols-3">
          <div class="rounded-xl bg-slate-50/50 p-5 border border-slate-100/50 transition-colors hover:bg-slate-50">
            <dt class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Date
            </dt>
            <dd class="text-sm font-bold text-slate-900">
              {{ formatDate(query.data.value.eventDate) }}
            </dd>
          </div>
          <div class="rounded-xl bg-slate-50/50 p-5 border border-slate-100/50 transition-colors hover:bg-slate-50">
            <dt class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Status
            </dt>
            <dd>
              <EventStatusBadge :status="query.data.value.status" />
            </dd>
          </div>
          <div class="rounded-xl bg-slate-50/50 p-5 border border-slate-100/50 transition-colors hover:bg-slate-50">
            <dt class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Currency
            </dt>
            <dd class="text-sm font-bold text-slate-900">
              {{ query.data.value.currency }}
            </dd>
          </div>
        </dl>
      </AppCard>

      <AppCard>
        <SectionHeader
          title="Next step"
          description="Recipient funds define the causes that contributors can support within this event."
        />
        <div class="mt-6 space-y-3">
          <AppButton
            full-width
            @click="router.push(`/admin/events/${eventId}/recipient-funds/new`)"
          >
            Create recipient fund
          </AppButton>
          <AppButton
            full-width
            variant="secondary"
            @click="router.push(`/contribute/${eventId}`)"
          >
            Preview storefront
          </AppButton>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent } from '../composables/useEvents'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import EventStatusBadge from '../components/EventStatusBadge.vue'
import { formatDate } from '@/shared/utils/formatters'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => String(route.params.id ?? ''))
const query = useEvent(eventId.value)
</script>
