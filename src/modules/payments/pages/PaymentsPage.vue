<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Payments"
      description="Monitor payment attempts, provider references, and real-time transaction status across all gateways."
    >
      <template #actions>
        <AppButton
          variant="outline"
          class="!rounded-xl bg-white shadow-sm border-slate-200"
        >
          <Download class="w-4 h-4 mr-2 text-slate-400" />
          Export Transaction Log
        </AppButton>
      </template>
    </AdminPageHeader>

    <AdminMetricGrid>
      <MetricCard
        label="Gross Transactions"
        :value="payments.length.toString()"
        icon="CreditCard"
        color="slate"
      />
      <MetricCard
        label="Success Rate"
        value="98.4%"
        icon="CheckCircle"
        color="emerald"
      />
      <MetricCard
        label="Volume (24h)"
        value="GHS 4,200"
        icon="TrendingUp"
        color="blue"
      />
      <MetricCard
        label="Avg Processing"
        value="1.2s"
        icon="Zap"
        color="amber"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search by reference or provider..."
      >
        <template #extra>
          <AppSelect
            v-model="statusFilter"
            :options="statusOptions"
            class="w-48"
          />
        </template>
      </AdminFilterBar>

      <DataTable
        :columns="columns"
        :rows="filteredPayments"
        :loading="query.isLoading.value"
      >
        <template #cell:providerReference="{ value }">
          <div class="flex flex-col">
            <span class="text-sm font-black text-slate-900 tracking-tight">{{ value }}</span>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">Provider Ref</span>
          </div>
        </template>

        <template #cell:method="{ value }">
          <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{{ value }}</span>
        </template>

        <template #cell:status="{ value }">
          <StatusBadge
            :status="value"
            :tone="getStatusTone(value)"
          />
        </template>

        <template #cell:amount="{ value }">
          <span class="text-sm font-black text-slate-900 italic">{{ value }}</span>
        </template>

        <template #cell:contributionId>
          <AppButton 
            variant="ghost" 
            size="sm" 
            class="!px-3 !py-1 !rounded-lg bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all border border-slate-100"
          >
            Contribution
          </AppButton>
        </template>

        <template #cell:receiptId="{ value }">
          <AppButton 
            v-if="value"
            variant="ghost" 
            size="sm" 
            class="!px-3 !py-1 !rounded-lg bg-violet-50 text-[10px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-900 transition-all border border-violet-100"
          >
            Receipt
          </AppButton>
          <span
            v-else
            class="text-[9px] font-black text-slate-300 uppercase tracking-widest"
          >N/A</span>
        </template>

        <template #cell:createdAt="{ value }">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ value }}</span>
        </template>

        <template #rowActions>
          <RowActions
            :actions="[
              { label: 'View Timeline', icon: 'Clock', onClick: () => {} },
              { label: 'Provider Logs', icon: 'Database', onClick: () => {} }
            ]"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePayments } from '../composables/usePayments'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import { 
  Download,
  CreditCard,
  CheckCircle,
  TrendingUp,
  Zap
} from 'lucide-vue-next'

const query = usePayments()
const searchQuery = ref('')
const statusFilter = ref('')

const columns = [
  { key: 'providerReference', label: 'Reference', sortable: true },
  { key: 'method', label: 'Method' },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'contributionId', label: 'Entity' },
  { key: 'receiptId', label: 'Receipt' },
  { key: 'createdAt', label: 'Processed', sortable: true },
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

function getStatusTone(status: string) {
  const s = status.toLowerCase()
  if (s === 'completed' || s === 'success') return 'success'
  if (s === 'pending') return 'amber'
  if (s === 'failed') return 'red'
  return 'neutral'
}
</script>
