<template>
  <AppTable
    caption="Self donation history"
    :columns="columns"
    :rows="rows"
    row-key="id"
  />
</template>

<script setup lang="ts">
import AppTable from '@/shared/components/tables/AppTable.vue'
import type { SelfDonationHistoryItem } from '../types/selfDonation'

defineProps<{
  rows: SelfDonationHistoryItem[]
}>()

const columns = [
  { key: 'amount', label: 'Amount' },
  { key: 'receiptStatus', label: 'Receipt link' },
]
</script>
