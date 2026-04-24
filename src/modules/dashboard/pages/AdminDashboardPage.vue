<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Dashboard"
      description="Keep an eye on collection activity, upcoming work, and placeholder finance insights."
    />

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading dashboard…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load dashboard"
      :message="query.error.value?.message ?? 'Try again in a moment.'"
      show-retry
      @retry="query.refetch"
    />
    <template v-else>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total events"
          :value="query.data.value?.totalEvents ?? '0'"
          hint="Live from event service"
        />
        <MetricCard
          label="Total contributions"
          :value="query.data.value?.totalContributions ?? '0'"
          hint="Placeholder until contribution reporting lands"
        />
        <MetricCard
          label="Total collected"
          :value="query.data.value?.totalCollected ?? 'GBP 0.00'"
          hint="Placeholder"
        />
        <MetricCard
          label="Active recipient funds"
          :value="query.data.value?.activeRecipientFunds ?? '0'"
          hint="Placeholder"
        />
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <DashboardPlaceholderPanel
          title="Recent contributions"
          description="A compact feed for the latest contribution activity."
          body="Recent contributions will surface here once contribution APIs are connected."
        />
        <DashboardPlaceholderPanel
          title="Payment method breakdown"
          description="A quick snapshot of collection mix by method."
          body="Payment method reporting is stubbed for now, ready for backend expansion."
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from '../composables/useDashboard'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import DashboardPlaceholderPanel from '../components/DashboardPlaceholderPanel.vue'

const query = useDashboard()
</script>
