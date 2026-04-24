<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Collector"
      title="Recent collections"
      description="Review recent receipts and assisted payment placeholders."
    />
    <AppTable
      caption="Collector history"
      :columns="columns"
      :rows="query.data.value ?? []"
      row-key="id"
    >
      <template #cell:status="{ value }">
        <ReceiptStatusBadge :status="String(value)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { useCollectorHistory } from '../composables/useCollector'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'

const query = useCollectorHistory()
const columns = [
  { key: 'receiptNumber', label: 'Receipt' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Receipt' },
]
</script>
