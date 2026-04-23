<template>
  <div>
    <PageHeader
      title="Events"
      description="Manage your collection events."
    >
      <template #actions>
        <AppButton @click="$router.push('/admin/events/new')">
          Create Event
        </AppButton>
      </template>
    </PageHeader>

    <AppCard>
      <LoadingState
        v-if="isLoading"
        text="Loading events..."
      />
      <ErrorState
        v-else-if="isError"
        title="Failed to load events"
        :message="error?.message"
      />
      <EmptyState
        v-else-if="!events?.length"
        title="No events found"
        description="Get started by creating a new event."
      >
        <template #action>
          <AppButton @click="$router.push('/admin/events/new')">
            Create Event
          </AppButton>
        </template>
      </EmptyState>
      <AppTable
        v-else
        :columns="columns"
        :data="events"
      >
        <template #cell(isActive)="{ value }">
          <AppBadge :variant="value ? 'green' : 'gray'">
            {{ value ? 'Active' : 'Draft' }}
          </AppBadge>
        </template>
        <template #cell(actions)="{ row }">
          <AppButton
            variant="ghost"
            size="sm"
            @click="$router.push(`/admin/events/${row.id}`)"
          >
            View
          </AppButton>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { eventsApi } from '../../../../modules/events/services/eventsApi'
import PageHeader from '../../../../shared/components/layout/PageHeader.vue'
import AppButton from '../../../../shared/components/ui/AppButton.vue'
import AppCard from '../../../../shared/components/ui/AppCard.vue'
import AppTable from '../../../../shared/components/ui/AppTable.vue'
import AppBadge from '../../../../shared/components/ui/AppBadge.vue'
import LoadingState from '../../../../shared/components/feedback/LoadingState.vue'
import ErrorState from '../../../../shared/components/feedback/ErrorState.vue'
import EmptyState from '../../../../shared/components/feedback/EmptyState.vue'

const { data: events, isLoading, isError, error } = useQuery({
  queryKey: ['events'],
  queryFn: eventsApi.getEvents,
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'eventDate', label: 'Date' },
  { key: 'isActive', label: 'Status' },
  { key: 'actions', label: '' },
]
</script>
