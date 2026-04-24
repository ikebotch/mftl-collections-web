<template>
  <div class="space-y-6">
    <LoadingState
      v-if="query.isLoading.value"
      text="Loading event details…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load event"
      :message="query.error.value?.message ?? 'Try again later.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <AppCard
      v-else-if="query.data.value"
      class="border-white/10 bg-white/95 shadow-2xl shadow-slate-950/30"
    >
      <SectionHeader
        :title="query.data.value.title"
        :description="query.data.value.description || 'Event details ready for quick collection capture.'"
      />
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Date
          </p>
          <p class="mt-2 text-lg font-semibold text-slate-900">
            {{ query.data.value.eventDate || 'TBD' }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Status
          </p>
          <p class="mt-2 text-lg font-semibold capitalize text-slate-900">
            {{ query.data.value.status }}
          </p>
        </div>
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
        <AppButton @click="router.push(`/collector/contributions/new?eventId=${query.data.value.id}`)">
          Record cash contribution
        </AppButton>
        <AppButton
          variant="secondary"
          @click="router.push(`/admin/events/${query.data.value.id}/recipient-funds`)"
        >
          View recipient funds
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { eventsService } from '@/modules/events/services/eventsService'
import type { Event } from '@/modules/events/types/event'
import type { ApiError } from '@/core/api/apiError'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => String(route.params.id ?? ''))
const query = useQuery<Event, ApiError>({
  queryKey: ['collector-event', eventId],
  queryFn: () => eventsService.getById(eventId.value),
})
</script>
