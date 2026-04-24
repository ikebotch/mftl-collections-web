<template>
  <div class="space-y-8 max-w-lg mx-auto">
    <div class="text-center space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest mb-2">
        <span class="w-1.5 h-1.5 rounded-full bg-brand-500" />
        Collector Active
      </div>
      <PageHeader
        title="Field Dashboard"
        description="Ready for today's collection shift."
      />
    </div>

    <div class="grid gap-4">
      <MetricCard
        label="Today's Total"
        :value="query.data.value?.todayCollections ?? '$0.00'"
        hint="Cash & Mobile Money"
      />
      <div class="grid grid-cols-2 gap-4">
        <MetricCard
          label="Receipts"
          :value="query.data.value?.receiptsIssued ?? '0'"
          hint="Issued today"
        />
        <MetricCard
          label="Assignments"
          :value="query.data.value?.assignedEvents ?? '0'"
          hint="Active events"
        />
      </div>
    </div>

    <AppCard
      padded
      class="bg-brand-600 text-white border-none shadow-lg shadow-brand-600/20"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold font-display">
          Offline Ready
        </h3>
        <div class="px-2 py-1 rounded-md bg-white/20 text-[10px] font-bold uppercase tracking-widest">
          Beta
        </div>
      </div>
      <p class="text-sm text-brand-100 font-medium leading-relaxed">
        Offline synchronization is active. You can continue collecting even without a network connection.
      </p>
      <AppButton
        variant="secondary"
        size="sm"
        class="mt-6 w-full bg-white text-brand-600 border-none hover:bg-brand-50"
      >
        Check Sync Status
      </AppButton>
    </AppCard>

    <div class="pt-4">
      <AppButton
        full-width
        size="lg"
        @click="$router.push('/collector/events')"
      >
        Start New Collection
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCollectorDashboard } from '../composables/useCollector'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'

const query = useCollectorDashboard()
</script>
