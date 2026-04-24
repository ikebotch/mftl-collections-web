<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Events"
      description="Track fundraising events, their status, and the funds attached to them."
    >
      <template #actions>
        <AppButton @click="router.push('/admin/events/new')">
          Create event
        </AppButton>
      </template>
    </PageHeader>

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading events…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load events"
      :message="query.error.value?.message ?? 'Please retry.'"
      show-retry
      @retry="query.refetch"
    />
    <EmptyState
      v-else-if="!query.data.value?.length"
      title="No events yet"
      description="Create your first event to open the public contribution flow."
    >
      <template #action>
        <AppButton @click="router.push('/admin/events/new')">
          Create event
        </AppButton>
      </template>
    </EmptyState>
    <AppTable
      v-else
      caption="Events table"
      :columns="columns"
      :rows="query.data.value"
      row-key="id"
    >
      <template #cell:eventDate="{ value }">
        {{ formatEventDate(value) }}
      </template>
      <template #cell:status="{ value }">
        <EventStatusBadge :status="getEventStatus(value)" />
      </template>
      <template #cell:eventType="{ value }">
        <AppBadge tone="info">
          {{ value }}
        </AppBadge>
      </template>
      <template #cell:currency="{ value }">
        {{ value }}
      </template>
      <template #cell:actions="{ row }">
        <div class="flex gap-2">
          <AppButton
            variant="secondary"
            size="sm"
            @click="router.push(`/admin/events/${getRowValue(row, 'id')}`)"
          >
            View
          </AppButton>
          <AppButton
            variant="ghost"
            size="sm"
            @click="router.push(`/admin/events/${getRowValue(row, 'id')}/recipient-funds`)"
          >
            Funds
          </AppButton>
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useEvents } from '../composables/useEvents'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppBadge from '@/shared/components/badges/AppBadge.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatDate } from '@/shared/utils/formatters'
import EventStatusBadge from '../components/EventStatusBadge.vue'

const router = useRouter()
const query = useEvents()

const columns = [
  { key: 'title', label: 'Event' },
  { key: 'eventDate', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'eventType', label: 'Type' },
  { key: 'currency', label: 'Currency' },
  { key: 'actions', label: 'Actions' },
]

function getRowValue(row: unknown, key: string): string {
  if (row && typeof row === 'object') {
    return String((row as Record<string, unknown>)[key] ?? '')
  }

  return ''
}

function formatEventDate(value: unknown): string {
  return formatDate(typeof value === 'string' ? value : null)
}

function getEventStatus(value: unknown): 'active' | 'draft' {
  return value === 'active' ? 'active' : 'draft'
}
</script>
