<template>
  <div>
    <div
      v-if="isLoading"
      class="pt-10"
    >
      <LoadingState text="Loading event details..." />
    </div>
    
    <ErrorState
      v-else-if="isError"
      title="Failed to load event"
      :message="error?.message"
    />
    
    <div v-else-if="event">
      <PageHeader
        :title="event.title"
        :description="event.description"
      >
        <template #actions>
          <AppButton @click="$router.push(`/admin/events/${event.id}/recipient-funds/new`)">
            Add Recipient Fund
          </AppButton>
        </template>
      </PageHeader>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          label="Status"
          :value="event.isActive ? 'Active' : 'Draft'"
        />
        <MetricCard
          label="Date"
          :value="event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'"
        />
        <MetricCard
          label="Event ID"
          :value="event.id.split('-')[0]"
        />
      </div>

      <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
        Recipient Funds
      </h3>
      <AppCard>
        <LoadingState
          v-if="fundsLoading"
          text="Loading funds..."
        />
        <ErrorState
          v-else-if="isFundsError"
          title="Failed to load funds"
          :message="fundsError?.message"
        />
        <EmptyState
          v-else-if="!funds?.length"
          title="No recipient funds"
          description="Create a fund to start collecting contributions for this event."
        >
          <template #action>
            <AppButton @click="$router.push(`/admin/events/${event.id}/recipient-funds/new`)">
              Add Recipient Fund
            </AppButton>
          </template>
        </EmptyState>
        <AppTable
          v-else
          :columns="fundColumns"
          :data="funds"
        >
          <template #cell(targetAmount)="{ value }">
            {{ formatCurrency(value) }}
          </template>
          <template #cell(collectedAmount)="{ value }">
            {{ formatCurrency(value) }}
          </template>
        </AppTable>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { eventsApi } from '../../../../modules/events/services/eventsApi'
import { recipientFundsApi } from '../../../../modules/recipient-funds/services/recipientFundsApi'
import PageHeader from '../../../../shared/components/layout/PageHeader.vue'
import AppButton from '../../../../shared/components/ui/AppButton.vue'
import AppCard from '../../../../shared/components/ui/AppCard.vue'
import AppTable from '../../../../shared/components/ui/AppTable.vue'
import MetricCard from '../../../../shared/components/ui/MetricCard.vue'
import LoadingState from '../../../../shared/components/feedback/LoadingState.vue'
import ErrorState from '../../../../shared/components/feedback/ErrorState.vue'
import EmptyState from '../../../../shared/components/feedback/EmptyState.vue'

const route = useRoute()
const eventId = route.params.id as string

const { data: event, isLoading, isError, error } = useQuery({
  queryKey: ['events', eventId],
  queryFn: () => eventsApi.getEvent(eventId),
})

const { data: funds, isLoading: fundsLoading, isError: isFundsError, error: fundsError } = useQuery({
  queryKey: ['events', eventId, 'funds'],
  queryFn: () => recipientFundsApi.getFundsByEvent(eventId),
  enabled: !!eventId
})

const fundColumns = [
  { key: 'name', label: 'Name' },
  { key: 'targetAmount', label: 'Target' },
  { key: 'collectedAmount', label: 'Collected' },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
}
</script>
