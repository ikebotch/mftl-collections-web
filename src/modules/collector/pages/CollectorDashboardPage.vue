<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Collector"
      title="Collector dashboard"
      description="Fast access to assigned events, receipts, and offline mode placeholder status."
    />
    <div class="grid gap-4 md:grid-cols-3">
      <CollectorStatCard
        label="Today's collections"
        :value="query.data.value?.todayCollections ?? 'GBP 0.00'"
        hint="Cash-first dashboard metric"
      />
      <CollectorStatCard
        label="Receipts issued"
        :value="query.data.value?.receiptsIssued ?? '0'"
        hint="Receipt confirmations this shift"
      />
      <CollectorStatCard
        label="Assigned events"
        :value="query.data.value?.assignedEvents ?? '0'"
        hint="Current collector assignment count"
      />
    </div>
    <AppCard>
      <SectionHeader
        title="Offline mode"
        description="Placeholder only for now. Full offline sync is intentionally deferred."
      />
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { useCollectorDashboard } from '../composables/useCollector'
import CollectorStatCard from '../components/CollectorStatCard.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'

const query = useCollectorDashboard()
</script>
