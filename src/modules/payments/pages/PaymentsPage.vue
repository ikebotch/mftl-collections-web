<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Payments"
      description="Track payment attempts, provider references, and settlement-readiness placeholders."
    />
    <LoadingState
      v-if="query.isLoading.value"
      text="Loading payments…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load payments"
      :message="query.error.value?.message ?? 'Try again later.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <EmptyState
      v-else-if="!query.data.value?.length"
      title="No payments available"
      description="Payment attempts will appear here after online payment initiation."
    />
    <AppTable
      v-else
      caption="Payments table"
      :columns="columns"
      :rows="query.data.value ?? []"
      row-key="id"
    >
      <template #cell:status="{ value }">
        <PaymentStatusBadge :status="String(value)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { usePayments } from '../composables/usePayments'
import PaymentStatusBadge from '../components/PaymentStatusBadge.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'

const query = usePayments()
const columns = [
  { key: 'createdAt', label: 'Created' },
  { key: 'providerReference', label: 'Provider reference' },
  { key: 'method', label: 'Method' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
]
</script>
