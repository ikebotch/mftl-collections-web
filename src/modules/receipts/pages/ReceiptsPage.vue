<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Receipts"
      description="Monitor receipts and prepare for print/download integration."
    />
    <LoadingState
      v-if="query.isLoading.value"
      text="Loading receipts…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load receipts"
      :message="query.error.value?.message ?? 'Try again later.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <EmptyState
      v-else-if="!query.data.value?.length"
      title="No receipts available"
      description="Receipts will appear here after contributions are settled."
    />
    <AppTable
      v-else
      caption="Receipts table"
      :columns="columns"
      :rows="query.data.value ?? []"
      row-key="id"
    >
      <template #cell:status="{ value }">
        <ReceiptStatusBadge :status="String(value)" />
      </template>
      <template #cell:contributionStatus="{ value }">
        <ContributionStatusBadge :status="String(value)" />
      </template>
      <template #cell:paymentStatus="{ value }">
        <PaymentStatusBadge :status="String(value)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { useReceipts } from '../composables/useReceipts'
import ReceiptStatusBadge from '../components/ReceiptStatusBadge.vue'
import PaymentStatusBadge from '@/modules/payments/components/PaymentStatusBadge.vue'
import ContributionStatusBadge from '@/modules/contributions/components/ContributionStatusBadge.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'

const query = useReceipts()
const columns = [
  { key: 'receiptNumber', label: 'Receipt' },
  { key: 'issuedAt', label: 'Issued' },
      { key: 'eventTitle', label: 'Event' },
      { key: 'recipientFundName', label: 'Recipient fund' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Receipt status' },
      { key: 'contributionStatus', label: 'Contribution' },
      { key: 'paymentStatus', label: 'Payment' },
    ]
</script>
