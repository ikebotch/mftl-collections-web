<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Receipts"
      description="Monitor receipts and prepare for print/download integration."
    />
    <EmptyState
      v-if="!query.data.value?.length"
      title="No receipts available"
      description="Receipt detail and download flows are still placeholders."
    />
    <ReceiptPlaceholderCard />
  </div>
</template>

<script setup lang="ts">
import { useReceipts } from '../composables/useReceipts'
import ReceiptPlaceholderCard from '../components/ReceiptPlaceholderCard.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'

const query = useReceipts()
</script>
