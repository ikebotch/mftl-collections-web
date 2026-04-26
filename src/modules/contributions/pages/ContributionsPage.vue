<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Contributions"
      description="Review incoming collections, payment status, receipts, and donor activity."
    />

    <AdminMetricGrid>
      <MetricCard
        label="Total Raised"
        :value="totalRaisedFormatted"
        icon="TrendingUp"
        color="green"
        :trend="contributions.length > 0 ? '+100%' : '0%'"
      />
      <MetricCard
        label="Total Records"
        :value="String(contributions.length)"
        icon="Calendar"
        color="purple"
      />
      <MetricCard
        label="Verified Funds"
        :value="String(contributions.filter(c => c.status === 'Completed' || c.status === 'Collected').length)"
        icon="ShieldCheck"
        color="slate"
      />
      <MetricCard
        label="Failed Payments"
        :value="String(contributions.filter(c => c.status === 'Failed').length)"
        icon="AlertCircle"
        color="red"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
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
                class="px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all"
                :class="activeFilters.methods.includes(m) ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'"
                @click="toggleFilter('methods', m)"
              >
                {{ m }}
              </button>
            </div>
          </div>
        </template>
      </AdminFilterBar>

      <DataTable
        :columns="columns"
        :rows="filteredContributions"
        :loading="query.isLoading.value"
        exportable
        title="Contribution Audit Log"
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
              <span class="text-xs font-bold text-slate-400">{{ selectedContribution.paymentMethod }}</span>
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
        </template>

        <!-- Edit Mode -->
        <template v-else>
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</label>
              <input 
                v-model="editForm.amount"
                type="number" 
                class="w-full p-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all font-black text-xl"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Contributor Name</label>
              <input 
                v-model="editForm.contributorName"
                type="text" 
                class="w-full p-4 rounded-xl border border-slate-200 focus:border-violet-500 outline-none transition-all font-bold"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
              <select 
                v-model="editForm.status"
                class="w-full p-4 rounded-xl border border-slate-200 focus:border-violet-500 outline-none transition-all font-bold appearance-none bg-white"
              >
                <option value="RecordedCash">Recorded Cash</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Note</label>
              <textarea 
                v-model="editForm.note"
                rows="4"
                class="w-full p-4 rounded-xl border border-slate-200 focus:border-violet-500 outline-none transition-all font-medium"
                placeholder="Internal audit notes..."
              ></textarea>
            </div>
          </div>
        </template>
      </div>

      <template #actions>
        <template v-if="!isEditing">
          <AppButton
            variant="primary"
            class="flex-1 !rounded-xl shadow-premium"
            @click="isEditing = true"
          >
            Edit Record
          </AppButton>
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="viewReceipt(selectedContribution!)"
          >
            Receipt
          </AppButton>
        </template>
        <template v-else>
          <AppButton
            variant="primary"
            class="flex-1 !rounded-xl shadow-premium"
            :loading="updateMutation.isPending.value"
            @click="handleUpdate"
          >
            Save Changes
          </AppButton>
          <AppButton
            variant="ghost"
            class="!rounded-xl"
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
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import type { ContributionRow } from '../types/contribution'
import { useToastStore } from '@/shared/stores/useToastStore'

const searchQuery = ref('')
const activeFilters = ref({
  status: [] as string[],
  methods: [] as string[]
})

const query = useContributions()
const updateMutation = useUpdateContribution()
const toast = useToastStore()
const contributions = computed(() => query.data.value || [])

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

  return items
})

const totalRaisedFormatted = computed(() => {
  const currencyGroups: Record<string, number> = {}
  contributions.value.forEach(c => {
    const amt = c.amountValue || parseFloat(String(c.amount).replace(/[^0-9.]/g, ''))
    const cur = c.amount.split(' ')[0] || 'GHS'
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

const columns = [
  { key: 'date', label: 'Date/Time' },
  { key: 'donor', label: 'Donor' },
  { key: 'event', label: 'Event' },
  { key: 'fund', label: 'Fund' },
  { key: 'method', label: 'Method' },
  { key: 'status', label: 'Status' }
]

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
