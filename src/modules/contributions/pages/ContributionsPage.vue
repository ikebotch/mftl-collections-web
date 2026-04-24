<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Contributions"
      description="Review incoming collections, payment status, receipts, and donor activity."
    />

    <AdminMetricGrid>
      <MetricCard
        label="Total Raised"
        value="GHS 124.5k"
        icon="TrendingUp"
        color="green"
        trend="+15%"
      />
      <MetricCard
        label="This Month"
        value="GHS 12.2k"
        icon="Calendar"
        color="purple"
        trend="+4%"
      />
      <MetricCard
        label="Pending Receipts"
        value="0"
        icon="FileText"
        color="slate"
      />
      <MetricCard
        label="Failed Payments"
        value="0"
        icon="AlertCircle"
        color="red"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search donor, event, or fund..."
      />

      <DataTable
        :columns="columns"
        :rows="filteredContributions"
        :loading="query.isLoading.value"
      >
        <template #cell:date="{ value }">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ value }}</span>
        </template>

        <template #cell:donor="{ row }">
          <span class="text-xs font-bold text-slate-900">{{ row.contributorName }}</span>
        </template>

        <template #cell:event="{ value }">
          <span class="text-xs font-bold text-slate-600">{{ value }}</span>
        </template>

        <template #cell:fund="{ value }">
          <span class="text-xs font-bold text-slate-500">{{ value }}</span>
        </template>

        <template #cell:method="{ value }">
          <span class="text-[10px] font-black text-slate-900 tracking-widest uppercase">{{ value }}</span>
        </template>

        <template #cell:status="{ row }">
          <StatusBadge
            :status="row.status"
            :tone="row.status.toLowerCase() === 'completed' || row.status.toLowerCase() === 'collected' ? 'success' : 'neutral'"
          />
        </template>

        <template #rowActions="{ row }">
          <RowActions
            :actions="[
              { label: 'View Details', icon: 'FileText', onClick: () => openDrawer(row) },
              { label: 'View Receipt', icon: 'Download', onClick: () => viewReceipt(row) }
            ]"
          />
        </template>
      </DataTable>
    </div>

    <!-- Detail Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Contribution Details"
      :subtitle="selectedContribution?.id"
      @close="isDrawerOpen = false"
    >
      <div
        v-if="selectedContribution"
        class="space-y-8"
      >
        <section class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Total Amount
          </p>
          <p class="text-4xl font-black text-slate-900 tracking-tighter">
            {{ selectedContribution.amount }}
          </p>
          <div class="mt-4 flex items-center gap-2">
            <StatusBadge
              :status="selectedContribution.status"
              tone="success"
            />
            <span class="text-xs font-bold text-slate-400">Recorded physical cash</span>
          </div>
        </section>

        <div class="grid grid-cols-2 gap-8">
          <div>
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Donor
            </h4>
            <p class="text-sm font-black text-slate-900">
              {{ selectedContribution.contributorName }}
            </p>
            <p class="text-xs font-bold text-slate-500 mt-1">
              {{ selectedContribution.contributorPhone }}
            </p>
          </div>
          <div>
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Method
            </h4>
            <p class="text-sm font-black text-slate-900 uppercase tracking-widest">
              {{ selectedContribution.paymentMethod }}
            </p>
            <p class="text-xs font-bold text-slate-500 mt-1">
              Direct Collection
            </p>
          </div>
        </div>

        <div class="space-y-6 pt-6 border-t border-slate-100">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400">Event</span>
            <span class="text-xs font-black text-slate-900">{{ selectedContribution.event }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400">Target Fund</span>
            <span class="text-xs font-black text-slate-900">{{ selectedContribution.recipientFund }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400">Receipt ID</span>
            <span class="text-xs font-mono text-slate-900">{{ selectedContribution.receiptId || 'N/A' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400">Collector</span>
            <span class="text-xs font-black text-slate-900">{{ selectedContribution.collectorName || 'System Admin' }}</span>
          </div>
        </div>

        <div
          v-if="selectedContribution.note"
          class="p-6 rounded-2xl bg-amber-50 text-amber-700"
        >
          <p class="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">
            Note
          </p>
          <p class="text-sm font-medium italic">
            "{{ selectedContribution.note }}"
          </p>
        </div>
      </div>

      <template #actions>
        <AppButton
          variant="primary"
          class="flex-1 !rounded-xl shadow-premium"
          @click="viewReceipt(selectedContribution!)"
        >
          View Full Receipt
        </AppButton>
        <AppButton
          variant="outline"
          class="!rounded-xl"
        >
          Send Copy
        </AppButton>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContributions } from '../composables/useContributions'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import type { ContributionRow } from '../types/contribution'

const searchQuery = ref('')
const query = useContributions()
const contributions = computed(() => query.data.value || [])

const isDrawerOpen = ref(false)
const selectedContribution = ref<ContributionRow | null>(null)

const columns = [
  { key: 'date', label: 'Date/Time' },
  { key: 'donor', label: 'Donor' },
  { key: 'event', label: 'Event' },
  { key: 'fund', label: 'Fund' },
  { key: 'method', label: 'Method' },
  { key: 'status', label: 'Status' }
]

const filteredContributions = computed(() => {
  if (!searchQuery.value) return contributions.value
  const q = searchQuery.value.toLowerCase()
  return contributions.value.filter(c => 
    c.contributorName.toLowerCase().includes(q) || 
    c.event.toLowerCase().includes(q) || 
    c.recipientFund.toLowerCase().includes(q)
  )
})

function openDrawer(item: ContributionRow) {
  selectedContribution.value = item
  isDrawerOpen.value = true
}

function viewReceipt(item: ContributionRow) {
  if (item.receiptId) {
    window.open(`/receipts/${item.receiptId}`, '_blank')
  } else {
    alert('No receipt issued for this contribution yet.')
  }
}
</script>
