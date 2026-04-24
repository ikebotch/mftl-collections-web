<template>
  <div class="space-y-12">
    <AdminPageHeader
      title="Payments"
      description="Monitor payment attempts, provider references, and transaction status."
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
      text="Syncing payment transactions..."
      class="py-32"
    />
    
    <template v-else-if="payments">
      <!-- Search & Filters -->
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="flex-1 relative w-full">
          <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <AppInput
            v-model="searchQuery"
            placeholder="Search by reference or provider..."
            class="!pl-14 !py-7 !rounded-3xl !bg-white border-2 border-slate-100 focus:border-slate-900 shadow-sm transition-all"
          />
        </div>
        <AppSelect
          v-model="statusFilter"
          :options="statusOptions"
          class="w-full md:w-64 !py-7 !rounded-3xl !bg-white border-2 border-slate-100 shadow-sm"
        />
      </div>

      <!-- Transaction Table -->
      <AppCard class="!rounded-[3rem] overflow-hidden border-2 border-slate-100 shadow-2xl bg-white">
        <AppTable
          :columns="columns"
          :rows="filteredPayments"
          row-key="id"
          class="!border-none"
          empty-message="No payment transactions found matching criteria."
        >
          <template #cell:providerReference="{ value }">
            <div class="flex flex-col">
              <span class="text-sm font-black text-slate-900 tracking-tight">{{ value }}</span>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">External Ref</span>
            </div>
          </template>

          <template #cell:method="{ value }">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{{ value }}</span>
            </div>
          </template>

          <template #cell:status="{ value }">
            <PaymentStatusBadge
              :status="value"
              class="scale-90"
            />
          </template>

          <template #cell:amount="{ value }">
            <span class="text-sm font-black text-slate-900">{{ value }}</span>
          </template>

          <template #cell:contributionId>
            <div class="flex items-center gap-2">
              <AppButton 
                variant="ghost" 
                size="sm" 
                class="!px-3 !py-1 !rounded-lg bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all"
              >
                View Contrib
              </AppButton>
            </div>
          </template>

          <template #cell:receiptId="{ value }">
            <div
              v-if="value"
              class="flex items-center gap-2"
            >
              <AppButton 
                variant="ghost" 
                size="sm" 
                class="!px-3 !py-1 !rounded-lg bg-violet-50 text-[10px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-900 transition-all"
              >
                View Receipt
              </AppButton>
            </div>
            <span
              v-else
              class="text-[9px] font-black text-slate-300 uppercase tracking-widest"
            >N/A</span>
          </template>

          <template #cell:createdAt="{ value }">
            <span class="text-[10px] font-bold text-slate-600">{{ value }}</span>
          </template>
        </AppTable>
      </AppCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePayments } from '../composables/usePayments'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import PaymentStatusBadge from '../components/PaymentStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { Search, Download } from 'lucide-vue-next'

const query = usePayments()
const searchQuery = ref('')
const statusFilter = ref('')

const columns = [
  { key: 'providerReference', label: 'Reference' },
  { key: 'method', label: 'Method' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'contributionId', label: 'Contribution' },
  { key: 'receiptId', label: 'Receipt' },
  { key: 'createdAt', label: 'Created' },
]

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
]

const payments = computed(() => query.data.value || [])

const filteredPayments = computed(() => {
  let list = payments.value
  
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(p => 
      p.providerReference.toLowerCase().includes(s) || 
      p.method.toLowerCase().includes(s)
    )
  }
  
  if (statusFilter.value) {
    list = list.filter(p => p.status.toLowerCase() === statusFilter.value.toLowerCase())
  }
  
  return list
})
</script>
