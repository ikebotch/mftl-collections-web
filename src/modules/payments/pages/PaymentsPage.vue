<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Payments"
      description="Track payment attempts, provider references, and settlement-readiness placeholders."
    />
    <AppTable
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
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'

const query = usePayments()
const columns = [
  { key: 'providerReference', label: 'Provider reference' },
  { key: 'method', label: 'Method' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
]
</script>
