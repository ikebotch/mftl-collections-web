<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Settlements"
      description="Settlement summaries and reconciliation placeholders are ready for finance review."
    />
    <AppTable
      caption="Settlements table"
      :columns="columns"
      :rows="query.data.value ?? []"
      row-key="id"
    >
      <template #cell:status="{ value }">
        <SettlementStatusBadge :status="String(value)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { useSettlements } from '../composables/useSettlements'
import SettlementStatusBadge from '../components/SettlementStatusBadge.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'

const query = useSettlements()
const columns = [
  { key: 'summary', label: 'Summary' },
  { key: 'status', label: 'Status' },
]
</script>
