<template>
  <div class="space-y-12">
    <AdminPageHeader
      title="Receipts"
      description="Review issued receipts and verify contribution records."
    >
      <template #actions>
        <AppButton
          variant="outline"
          class="!rounded-xl bg-white shadow-sm border-slate-200"
        >
          <Download class="w-4 h-4 mr-2 text-slate-400" />
          Export Ledger
        </AppButton>
      </template>
    </AdminPageHeader>

    <LoadingState
      v-if="query.isLoading.value"
      text="Syncing financial audit trail..."
      class="py-32"
    />
    
    <template v-else-if="receipts">
      <!-- Search & Filters -->
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="flex-1 relative w-full">
          <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <AppInput
            v-model="searchQuery"
            placeholder="Search by receipt #, donor or event..."
            class="!pl-14 !py-7 !rounded-3xl !bg-white border-2 border-slate-100 focus:border-slate-900 shadow-sm transition-all"
          />
        </div>
        <AppSelect
          v-model="methodFilter"
          :options="methodOptions"
          class="w-full md:w-64 !py-7 !rounded-3xl !bg-white border-2 border-slate-100 shadow-sm"
        />
      </div>

      <!-- Audit Table -->
      <AppCard class="!rounded-[3rem] overflow-hidden border-2 border-slate-100 shadow-2xl bg-white">
        <AppTable
          :columns="columns"
          :rows="filteredReceipts"
          row-key="id"
          class="!border-none"
          empty-message="No registered receipts found matching criteria."
        >
          <template #cell:receiptNumber="{ value }">
            <div class="flex flex-col">
              <span class="text-sm font-black text-slate-900 tracking-tight">#{{ value }}</span>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Audit ID</span>
            </div>
          </template>

          <template #cell:contributorName="{ value }">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 shrink-0">
                {{ getInitials(value) }}
              </div>
              <span class="text-sm font-bold text-slate-900 truncate max-w-[150px]">
                {{ value }}
              </span>
            </div>
          </template>

          <template #cell:eventTitle="{ value, row }">
            <div class="flex flex-col max-w-[200px]">
              <span class="text-sm font-bold text-slate-900 truncate">{{ value }}</span>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 truncate">{{ row.recipientFundName }}</span>
            </div>
          </template>

          <template #cell:amount="{ value }">
            <span class="text-sm font-black text-slate-900">{{ value }}</span>
          </template>

          <template #cell:paymentMethod="{ value }">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ value }}</span>
            </div>
          </template>

          <template #cell:status="{ value }">
            <ReceiptStatusBadge
              :status="value"
              class="scale-90"
            />
          </template>

          <template #cell:issuedAt="{ value }">
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-slate-600">{{ value }}</span>
            </div>
          </template>

          <template #cell:actions="{ row }">
            <div class="flex items-center gap-2">
              <AppButton 
                variant="ghost" 
                size="sm" 
                class="!p-2 hover:bg-slate-50"
                @click="selectedReceipt = row"
              >
                <Eye class="w-4 h-4 text-slate-400 hover:text-slate-900" />
              </AppButton>
              <AppButton 
                variant="ghost" 
                size="sm"
                class="!p-2 hover:bg-slate-50"
              >
                <Printer class="w-4 h-4 text-slate-400 hover:text-slate-900" />
              </AppButton>
              <AppButton 
                variant="ghost" 
                size="sm"
                class="!p-2 hover:bg-slate-50"
              >
                <Download class="w-4 h-4 text-slate-400 hover:text-slate-900" />
              </AppButton>
            </div>
          </template>
        </AppTable>
      </AppCard>
    </template>

    <!-- Detail Drawer Placeholder -->
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
        <section class="p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-100 flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-3xl bg-white border-2 border-slate-100 flex items-center justify-center text-2xl font-black text-slate-900 shadow-premium mb-6">
            {{ getInitials(selectedReceipt.contributorName) }}
          </div>
          <h3 class="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            {{ selectedReceipt.contributorName }}
          </h3>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            Verified Contribution
          </p>
          
          <div class="mt-10 grid grid-cols-2 gap-4 w-full">
            <div class="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <h4 class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Amount
              </h4>
              <p class="text-xl font-black text-slate-900">
                {{ selectedReceipt.amount }}
              </p>
            </div>
            <div class="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
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
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Audit Allocation
          </h4>
          <div class="p-8 rounded-[2.5rem] border-2 border-slate-100 bg-white space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event</span>
              <span class="text-sm font-bold text-slate-900">{{ selectedReceipt.eventTitle }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient Fund</span>
              <span class="text-sm font-bold text-slate-900">{{ selectedReceipt.recipientFundName }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issued On</span>
              <span class="text-sm font-bold text-slate-900">{{ selectedReceipt.issuedAt }}</span>
            </div>
          </div>
        </section>
      </div>
      
      <template #actions>
        <AppButton
          class="flex-1 !rounded-2xl !py-4"
          variant="outline"
        >
          <Printer class="w-4 h-4 mr-3" />
          <span class="font-black uppercase tracking-widest text-[10px]">Print</span>
        </AppButton>
        <AppButton
          class="flex-1 !rounded-2xl !py-4 bg-slate-900 text-white"
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
import ReceiptStatusBadge from '../components/ReceiptStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import { 
  Search, 
  Download, 
  Printer, 
  Eye 
} from 'lucide-vue-next'

const query = useReceipts()
const selectedReceipt = ref<ReceiptRow | null>(null)
const searchQuery = ref('')
const methodFilter = ref('')

const columns = [
  { key: 'receiptNumber', label: 'Receipt' },
  { key: 'contributorName', label: 'Contributor' },
  { key: 'eventTitle', label: 'Event / Fund' },
  { key: 'amount', label: 'Amount' },
  { key: 'paymentMethod', label: 'Method' },
  { key: 'status', label: 'Status' },
  { key: 'issuedAt', label: 'Issued' },
  { key: 'actions', label: '' },
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
