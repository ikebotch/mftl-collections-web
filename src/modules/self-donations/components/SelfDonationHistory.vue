<template>
  <DataTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    empty-message="No self-donation history found."
  >
    <template #cell:amount="{ value }">
      <span class="text-sm font-black text-slate-900 italic">{{ value }}</span>
    </template>
    
    <template #cell:receiptStatus="{ value }">
      <AppButton
        v-if="value"
        variant="ghost"
        size="xs"
        class="text-[9px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-900"
      >
        View Receipt
      </AppButton>
      <span
        v-else
        class="text-[9px] font-bold text-slate-300 uppercase tracking-widest"
      >N/A</span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from '@/shared/components/tables/DataTable.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import type { SelfDonationHistoryItem } from '../types/selfDonation'

defineProps<{
  rows: SelfDonationHistoryItem[]
}>()

const columns = [
  { key: 'amount', label: 'Amount' },
  { key: 'receiptStatus', label: 'Receipt Link' },
]
</script>
