<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Contributions"
      description="Filter and review recorded contributions across events and recipient funds."
    />
    <AppToolbar>
      <AppInput
        id="contrib-date-range"
        model-value=""
        label="Date range"
        placeholder="This month"
      />
      <AppInput
        id="contrib-event"
        model-value=""
        label="Event"
        placeholder="All events"
      />
      <AppInput
        id="contrib-fund"
        model-value=""
        label="Recipient fund"
        placeholder="All funds"
      />
      <AppInput
        id="contrib-method"
        model-value=""
        label="Payment method"
        placeholder="All methods"
      />
      <template #actions>
        <AppButton variant="secondary">
          Reset filters
        </AppButton>
      </template>
    </AppToolbar>

    <AppTable
      caption="Contributions table"
      :columns="columns"
      :rows="query.data.value ?? []"
      row-key="id"
    >
      <template #cell:status="{ value }">
        <ContributionStatusBadge :status="String(value)" />
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { useContributions } from '../composables/useContributions'
import ContributionStatusBadge from '../components/ContributionStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppToolbar from '@/shared/components/toolbars/AppToolbar.vue'

const query = useContributions()
const columns = [
  { key: 'date', label: 'Date' },
  { key: 'event', label: 'Event' },
  { key: 'recipientFund', label: 'Recipient fund' },
  { key: 'paymentMethod', label: 'Method' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
]
</script>
