<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Reports"
      description="Contribution report filters use the shared toolbar pattern for consistency."
    />
    <AppToolbar>
      <AppInput
        id="report-date-range"
        model-value=""
        label="Date range"
        placeholder="Last 30 days"
      />
      <AppInput
        id="report-event"
        model-value=""
        label="Event"
        placeholder="All events"
      />
      <AppInput
        id="report-fund"
        model-value=""
        label="Recipient fund"
        placeholder="All funds"
      />
      <AppInput
        id="report-status"
        model-value=""
        label="Status"
        placeholder="All statuses"
      />
      <template #actions>
        <AppButton variant="secondary">
          Apply filters
        </AppButton>
      </template>
    </AppToolbar>
    <ExportReportCard />
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppToolbar from '@/shared/components/toolbars/AppToolbar.vue'
import ExportReportCard from '../components/ExportReportCard.vue'
</script>
