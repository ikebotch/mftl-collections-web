<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Receipts"
      description="Review issued receipts and verify contribution records across all channels."
    >
      <template #actions>
        <AppButton
          variant="outline"
          class="!rounded-none bg-white shadow-sm border-slate-200"
        >
          <Download class="w-4 h-4 mr-2 text-slate-400" />
          Export Ledger
        </AppButton>
      </template>
    </AdminPageHeader>

    <AdminMetricGrid>
      <MetricCard
        label="Total Receipts"
        :value="receipts.length.toString()"
        icon="FileText"
        color="slate"
      />
      <MetricCard
        label="Verified Value"
        value="GHS 12,450.00"
        icon="ShieldCheck"
        color="green"
      />
      <MetricCard
        label="Issued Today"
        value="14"
        icon="Zap"
        color="amber"
      />
      <MetricCard
        label="Audit Integrity"
        value="100%"
        icon="Shield"
        color="blue"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search by receipt #, donor or event..."
      >
        <template #extra>
          <AppSelect
            v-model="methodFilter"
            :options="methodOptions"
            class="w-48"
          />
        </template>
      </AdminFilterBar>

      <DataTable
        :columns="columns"
        :rows="filteredReceipts"
        :loading="query.isLoading.value"
        exportable
        title="Digital Receipt Archive"
      >
        <template #cell:receiptNumber="{ value }">
          <div class="flex flex-col">
            <span class="text-sm font-black text-slate-900 tracking-tight">#{{ value }}</span>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">Audit ID</span>
          </div>
        </template>

        <template #cell:contributorName="{ value }">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-none bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 shrink-0 uppercase">
              {{ getInitials(value) }}
            </div>
            <span class="text-sm font-black text-slate-900 tracking-tight truncate max-w-[150px]">
              {{ value }}
            </span>
          </div>
        </template>

        <template #cell:eventTitle="{ value, row }">
          <div class="flex flex-col max-w-[200px]">
            <span class="text-sm font-bold text-slate-900 truncate">{{ value }}</span>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 truncate italic">{{ row.recipientFundName }}</span>
          </div>
        </template>

        <template #cell:amount="{ value }">
          <span class="text-sm font-black text-slate-900 italic">{{ value }}</span>
        </template>

        <template #cell:status="{ value }">
          <StatusBadge
            :status="value"
            :tone="value === 'Verified' || value === 'Paid' ? 'success' : 'neutral'"
          />
        </template>

        <template #cell:issuedAt="{ value }">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ value }}</span>
        </template>

        <template #rowActions="{ row }">
          <RowActions
            :actions="[
              { label: 'View Receipt', icon: 'Eye', onClick: () => selectedReceipt = row },
              { label: 'Print Receipt', icon: 'Printer', onClick: () => {} },
              { label: 'Download PDF', icon: 'Download', onClick: () => {} }
            ]"
          />
        </template>
      </DataTable>
    </div>

    <!-- Detail Drawer -->
    <DetailDrawer
      :is-open="!!selectedReceipt"
      title="Receipt Details"
      :subtitle="selectedReceipt?.receiptNumber"
      @close="selectedReceipt = null"
    >
      <div
        v-if="selectedReceipt"
        class="space-y-10"
      >
        <section class="p-8 rounded-none bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-none bg-white border border-slate-100 flex items-center justify-center text-2xl font-black text-slate-900 shadow-premium mb-6 uppercase">
            {{ getInitials(selectedReceipt.contributorName) }}
          </div>
          <h3 class="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            {{ selectedReceipt.contributorName }}
          </h3>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">
            Verified Contribution
          </p>
          
          <div class="mt-10 grid grid-cols-2 gap-4 w-full">
            <div class="p-6 rounded-none bg-white border border-slate-100 shadow-soft">
              <h4 class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Amount
              </h4>
              <p class="text-xl font-black text-slate-900 italic">
                {{ selectedReceipt.amount }}
              </p>
            </div>
            <div class="p-6 rounded-none bg-white border border-slate-100 shadow-soft">
              <h4 class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Method
              </h4>
              <p class="text-xl font-black text-slate-900 uppercase tracking-tight italic">
                {{ selectedReceipt.paymentMethod }}
              </p>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 italic">
            Audit Allocation
          </h4>
          <div class="p-8 rounded-none border border-slate-100 bg-white space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event</span>
              <span class="text-sm font-black text-slate-900 tracking-tight">{{ selectedReceipt.eventTitle }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient Fund</span>
              <span class="text-sm font-black text-slate-900 tracking-tight">{{ selectedReceipt.recipientFundName }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issued On</span>
              <span class="text-sm font-bold text-slate-600">{{ selectedReceipt.issuedAt }}</span>
            </div>
          </div>
        </section>
      </div>
      
      <template #actions>
        <AppButton
          class="flex-1 !rounded-none !py-4"
          variant="outline"
        >
          <Printer class="w-4 h-4 mr-3" />
          <span class="font-black uppercase tracking-widest text-[10px]">Print</span>
        </AppButton>
        <AppButton
          class="flex-1 !rounded-none !py-4 shadow-premium"
          variant="primary"
        >
          <Download class="w-4 h-4 mr-3" />
          <span class="font-black uppercase tracking-widest text-[10px]">Download</span>
        </AppButton>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReceipts } from '../composables/useReceipts'
import type { ReceiptRow } from '../types/receipt'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import { 
  Download, 
  Printer
} from 'lucide-vue-next'

const query = useReceipts()
const selectedReceipt = ref<ReceiptRow | null>(null)
const searchQuery = ref('')
const methodFilter = ref('')

const columns = [
  { key: 'receiptNumber', label: 'Receipt', sortable: true },
  { key: 'contributorName', label: 'Contributor', sortable: true },
  { key: 'eventTitle', label: 'Event / Fund', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'issuedAt', label: 'Issued', sortable: true },
]

const methodOptions = [
  { label: 'All Methods', value: '' },
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Mobile Money', value: 'momo' },
]

const receipts = computed(() => query.data.value || [])

const filteredReceipts = computed(() => {
  let list = receipts.value
  
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(r => 
      r.receiptNumber.toLowerCase().includes(s) || 
      r.contributorName.toLowerCase().includes(s) ||
      r.eventTitle.toLowerCase().includes(s)
    )
  }
  
  if (methodFilter.value) {
    list = list.filter(r => r.paymentMethod.toLowerCase() === methodFilter.value.toLowerCase())
  }
  
  return list
})

function getInitials(name?: string) {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
