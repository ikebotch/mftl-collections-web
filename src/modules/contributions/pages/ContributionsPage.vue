<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Contributions"
      description="Review incoming collections, payment status, receipts, and donor activity."
    />

    <AdminMetricGrid>
      <MetricCard
        label="Total Raised"
        :value="query.isLoading.value ? '---' : totalRaisedFormatted"
        icon="TrendingUp"
        color="green"
        :trend="!query.isLoading.value && finalTotalItems > 0 ? '+100%' : '0%'"
      />
      <MetricCard
        label="Total Records"
        :value="query.isLoading.value ? '---' : String(finalTotalItems)"
        icon="Calendar"
        color="purple"
      />
      <MetricCard
        label="Verified Funds"
        :value="query.isLoading.value ? '---' : String(contributions.filter(c => c.status === 'Completed' || c.status === 'Collected').length)"
        icon="ShieldCheck"
        color="slate"
      />
      <MetricCard
        label="Failed Payments"
        :value="query.isLoading.value ? '---' : String(contributions.filter(c => c.status === 'Failed').length)"
        icon="AlertCircle"
        color="red"
      />
    </AdminMetricGrid>

    <LoadingState v-if="query.isLoading.value" text="Loading contributions..." />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load contributions"
      :message="query.error.value?.message ?? 'Check your connection and try again.'"
      show-retry
      @retry="query.refetch()"
    />
    <div v-else class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search donor, event, or fund..."
        :show-clear="searchQuery || activeFilters.status.length > 0 || activeFilters.methods.length > 0"
        @clear="clearAllFilters"
      >
        <template #sections>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Status</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="st in ['Completed', 'RecordedCash', 'Failed']"
                :key="st"
                class="px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all"
                :class="activeFilters.status.includes(st) ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'"
                @click="toggleFilter('status', st)"
              >
                {{ st === 'RecordedCash' ? 'Recorded Cash' : st }}
              </button>
            </div>
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Method</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="m in ['Direct Cash', 'Mobile Money']"
                :key="m"
                class="px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all rounded-full"
                :class="activeFilters.methods.includes(m) ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'"
                @click="toggleFilter('methods', m)"
              >
                {{ m }}
              </button>
            </div>
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Currency</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="curr in ['GHS', 'USD']" 
                :key="curr"
                class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all rounded-full"
                :class="activeFilters.currency === curr ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'"
                @click="activeFilters.currency = activeFilters.currency === curr ? '' : curr"
              >
                {{ curr }}
              </button>
            </div>
          </div>
        </template>
      </AdminFilterBar>
 
      <DataTable
        v-model:page="currentPage"
        :columns="columns"
        :rows="filteredContributions"
        :loading="query.isFetching.value"
        :total-items="finalTotalItems"
        :page-size="pageSize"
        exportable
        title="Contribution Audit Log"
      >
        <template #cell:date="{ value }">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ value }}</span>
        </template>
 
        <template #cell:donor="{ row }">
          <button 
            class="text-xs font-bold text-slate-900 hover:text-violet-600 transition-colors text-left"
            @click="openDrawer(row)"
          >
            {{ row.contributorName }}
          </button>
        </template>
 
        <template #cell:event="{ value }">
          <span class="text-xs font-bold text-slate-600">{{ value }}</span>
        </template>
 
        <template #cell:fund="{ value }">
          <span class="text-xs font-bold text-slate-500">{{ value }}</span>
        </template>
 
        <template #cell:collector="{ row }">
          <span class="text-xs font-black text-slate-900 lowercase">{{ row.collectorName || 'system' }}</span>
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
              { label: 'Edit Record', icon: 'Edit3', onClick: () => openEditDrawer(row) },
              { label: 'View Receipt', icon: 'Download', onClick: () => viewReceipt(row) }
            ]"
          />
        </template>
      </DataTable>
    </div>

    <!-- Detail/Edit Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      :title="isEditing ? 'Edit Contribution' : 'Contribution Details'"
      :subtitle="selectedContribution?.id"
      @close="closeDrawer"
    >
      <div
        v-if="selectedContribution"
        class="space-y-8"
      >
        <!-- Read Mode -->
        <template v-if="!isEditing">
          <ContributionDetailView :contribution="selectedContribution" />
        </template>

        <!-- Edit Mode -->
        <template v-else>
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</label>
              <input 
                v-model="editForm.amount"
                type="number" 
                class="w-full p-4 rounded-none border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all font-black text-xl"
              >
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Contributor Name</label>
              <input 
                v-model="editForm.contributorName"
                type="text" 
                class="w-full p-4 rounded-none border border-slate-200 focus:border-violet-500 outline-none transition-all font-bold"
              >
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
              <select 
                v-model="editForm.status"
                class="w-full p-4 rounded-none border border-slate-200 focus:border-violet-500 outline-none transition-all font-bold appearance-none bg-white"
              >
                <option value="RecordedCash">
                  Recorded Cash
                </option>
                <option value="Completed">
                  Completed
                </option>
                <option value="Failed">
                  Failed
                </option>
                <option value="Refunded">
                  Refunded
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Note</label>
              <textarea 
                v-model="editForm.note"
                rows="4"
                class="w-full p-4 rounded-none border border-slate-200 focus:border-violet-500 outline-none transition-all font-medium"
                placeholder="Internal audit notes..."
              />
            </div>
          </div>
        </template>
      </div>

      <template #actions>
        <template v-if="!isEditing">
          <AppButton
            variant="primary"
            class="flex-1 !rounded-none shadow-premium"
            @click="isEditing = true"
          >
            Edit Record
          </AppButton>
          <AppButton
            variant="outline"
            class="!rounded-none"
            @click="viewReceipt(selectedContribution!)"
          >
            Receipt
          </AppButton>
        </template>
        <template v-else>
          <AppButton
            variant="primary"
            class="flex-1 !rounded-none shadow-premium"
            :loading="updateMutation.isPending.value"
            @click="handleUpdate"
          >
            Save Changes
          </AppButton>
          <AppButton
            variant="ghost"
            class="!rounded-none"
            @click="isEditing = false"
          >
            Cancel
          </AppButton>
        </template>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContributions, useUpdateContribution } from '../composables/useContributions'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import ContributionDetailView from '@/modules/contributions/components/ContributionDetailView.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import type { ContributionRow } from '../types/contribution'
import { useToastStore } from '@/shared/stores/useToastStore'

const searchQuery = ref('')
const activeFilters = ref({
  status: [] as string[],
  methods: [] as string[],
  currency: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const query = useContributions(computed(() => ({ 
  page: currentPage.value, 
  pageSize: pageSize.value 
})))
const updateMutation = useUpdateContribution()
const toast = useToastStore()
const contributions = computed(() => query.data.value?.items || [])
const finalTotalItems = computed(() => query.data.value?.totalCount || 0)

const filteredContributions = computed(() => {
  let items = contributions.value
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(c => 
      c.contributorName.toLowerCase().includes(q) || 
      c.event.toLowerCase().includes(q) || 
      c.recipientFund.toLowerCase().includes(q)
    )
  }

  if (activeFilters.value.status.length > 0) {
    items = items.filter(c => activeFilters.value.status.includes(c.status))
  }

  if (activeFilters.value.methods.length > 0) {
    items = items.filter(c => activeFilters.value.methods.includes(c.paymentMethod))
  }

  if (activeFilters.value.currency) {
    items = items.filter(c => c.currency === activeFilters.value.currency)
  }

  return items
})

const totalRaisedFormatted = computed(() => {
  const currencyGroups: Record<string, number> = {}
  contributions.value.forEach(c => {
    const amt = c.amountValue
    const cur = c.currency || 'GHS'
    currencyGroups[cur] = (currencyGroups[cur] || 0) + amt
  })
  
  if (Object.keys(currencyGroups).length === 0) return 'GHS 0.00'
  return Object.entries(currencyGroups)
    .map(([cur, amt]) => formatCurrency(amt, cur))
    .join(' • ')
})

const isDrawerOpen = ref(false)
const isEditing = ref(false)
const selectedContribution = ref<ContributionRow | null>(null)

const editForm = ref({
  amount: 0,
  contributorName: '',
  status: '',
  note: ''
})

const columns = computed(() => [
  { key: 'date', label: 'Date/Time', sortable: true },
  { key: 'donor', label: 'Donor', sortable: true },
  { key: 'amount', label: 'Amount', sortable: !!activeFilters.value.currency },
  { key: 'event', label: 'Event', sortable: true },
  { key: 'fund', label: 'Fund', sortable: true },
  { key: 'collector', label: 'Collector', sortable: true },
  { key: 'method', label: 'Method', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
])

function toggleFilter(type: 'status' | 'methods', value: string) {
  const index = activeFilters.value[type].indexOf(value)
  if (index > -1) {
    activeFilters.value[type].splice(index, 1)
  } else {
    activeFilters.value[type].push(value)
  }
}

function clearAllFilters() {
  searchQuery.value = ''
  activeFilters.value.status = []
  activeFilters.value.methods = []
  activeFilters.value.currency = ''
}

function openDrawer(item: ContributionRow) {
  selectedContribution.value = item
  isEditing.value = false
  isDrawerOpen.value = true
}

function openEditDrawer(item: ContributionRow) {
  selectedContribution.value = item
  editForm.value = {
    amount: item.amountValue || 0,
    contributorName: item.contributorName,
    status: item.status,
    note: item.note || ''
  }
  isEditing.value = true
  isDrawerOpen.value = true
}

function closeDrawer() {
  isDrawerOpen.value = false
  isEditing.value = false
}

async function handleUpdate() {
  if (!selectedContribution.value) return

  try {
    await updateMutation.mutateAsync({
      id: selectedContribution.value.id,
      payload: editForm.value
    })
    toast.success('Contribution record updated successfully')
    isEditing.value = false
    isDrawerOpen.value = false
  } catch (err) {
    toast.error('Failed to update contribution')
  }
}

function viewReceipt(item: ContributionRow) {
  if (item.receiptId) {
    window.open(`/receipts/${item.receiptId}`, '_blank')
  } else {
    toast.error('No receipt issued for this contribution yet.')
  }
}
</script>
