<template>
  <div class="space-y-6">
    <section class="space-y-3">
      <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
        Collector
      </p>
      <h2 class="text-3xl font-semibold tracking-tight text-white">
        Assigned events
      </h2>
      <p class="max-w-2xl text-sm leading-6 text-slate-300">
        Choose an event to move quickly into contribution capture with the correct recipient funds.
      </p>
    </section>

    <AppCard class="border-white/10 bg-white/95 shadow-2xl shadow-slate-950/30">
      <LoadingState
        v-if="query.isLoading.value"
        text="Loading assigned events…"
      />
      <ErrorState
        v-else-if="query.isError.value"
        title="Could not load collector events"
        :message="query.error.value?.message ?? 'Try again later.'"
        :correlation-id="query.error.value?.correlationId"
        show-retry
        @retry="query.refetch"
      />
      <EmptyState
        v-else-if="(query.data.value?.length ?? 0) === 0"
        title="No assigned events yet"
        description="Events created in admin will appear here once they are available for collection."
      />
      <AppTable
        v-else
        caption="Assigned events"
        :columns="columns"
        :rows="query.data.value ?? []"
        row-key="id"
      >
        <template #cell:status="{ value }">
          <span class="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
            {{ value }}
          </span>
        </template>
        <template #cell:actions="{ row }">
          <AppButton
            size="sm"
            @click="router.push(`/collector/events/${getRowValue(row, 'id')}`)"
          >
            Open event
          </AppButton>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAssignedEvents } from '../composables/useCollector'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'

const router = useRouter()
const query = useAssignedEvents()
const columns = [
  { key: 'title', label: 'Event' },
  { key: 'eventDate', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

function getRowValue(row: unknown, key: string): string {
  if (row && typeof row === 'object') {
    return String((row as Record<string, unknown>)[key] ?? '')
  }

  return ''
}
</script>
