<template>
  <div class="space-y-10 selection:bg-violet-500/30">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900">
          Contributions Ledger
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          Audit and manage real-time financial inflows across all events.
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <AppButton
          variant="outline"
          class="!rounded-xl bg-white shadow-sm border-slate-200"
        >
          <Download class="w-4 h-4 mr-2 text-slate-400" />
          Export Audit Log
        </AppButton>
      </div>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Syncing financial ledger..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Sync failed"
      :message="query.error.value?.message ?? 'Connection error.'"
      show-retry
      @retry="query.refetch"
    />

    <template v-else-if="query.data.value">
      <!-- KPI Intelligence -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          label="Total Raised"
          :value="formatCurrency(stats.total, 'GHS')"
          icon="Wallet"
          color="purple"
          description="Aggregated revenue"
        />
        <MetricCard
          label="This Month"
          :value="formatCurrency(stats.monthly, 'GHS')"
          icon="Calendar"
          color="green"
          description="Current period"
        />
        <MetricCard
          label="Avg. Contribution"
          :value="formatCurrency(stats.average, 'GHS')"
          icon="TrendingUp"
          color="blue"
          description="Gift average"
        />
        <MetricCard
          label="Failed Payments"
          :value="stats.failedCount.toString()"
          icon="AlertCircle"
          color="red"
          description="Requires attention"
        />
        <MetricCard
          label="Pending Receipts"
          :value="stats.pendingReceiptsCount.toString()"
          icon="Clock"
          color="amber"
          description="In processing"
        />
      </div>

      <!-- Analytics & Charts Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AppCard class="lg:col-span-2 !p-8 border-none shadow-premium relative overflow-hidden">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400">
                Revenue Velocity
              </h3>
              <p class="text-xs font-bold text-slate-500 mt-1">
                Daily contribution volume (Last 14 days)
              </p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">Actual</span>
              </div>
            </div>
          </div>
          
          <!-- Mock Chart Visual -->
          <div class="h-48 flex items-end gap-2 px-2">
            <div 
              v-for="(val, i) in [40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95, 65, 88]" 
              :key="i"
              class="flex-1 bg-violet-500/10 rounded-t-lg transition-all hover:bg-violet-500/30 group relative"
              :style="{ height: `${val}%` }"
            >
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {{ val }}
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-4 px-1">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">14 Days Ago</span>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Today</span>
          </div>
        </AppCard>

        <AppCard class="!p-8 border-none shadow-premium">
          <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 text-center">
            Payment Methods
          </h3>
          <div class="space-y-6">
            <div
              v-for="method in stats.methods"
              :key="method.label"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span class="text-slate-600">{{ method.label }}</span>
                <span class="text-slate-900">{{ method.percentage }}%</span>
              </div>
              <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-slate-900 transition-all duration-1000"
                  :style="{ width: `${method.percentage}%` }"
                />
              </div>
            </div>
          </div>
          <div class="mt-8 pt-8 border-t border-slate-50 text-center">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Dominant Method
            </p>
            <p class="text-lg font-black text-slate-900 tracking-tight">
              Cash ({{ stats.methods[0]?.percentage }}%)
            </p>
          </div>
        </AppCard>
      </div>

      <!-- Filters & Search -->
      <AppCard class="!p-6 border-none shadow-soft">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[240px]">
            <AppInput 
              v-model="filters.search" 
              placeholder="Search donor name, phone, or receipt ID..." 
            >
              <template #icon>
                <Search class="w-4 h-4" />
              </template>
            </AppInput>
          </div>
          <div class="w-48">
            <AppSelect 
              v-model="filters.method" 
              :options="methodOptions" 
              placeholder="All Methods" 
            />
          </div>
          <div class="w-48">
            <AppSelect 
              v-model="filters.status" 
              :options="statusOptions" 
              placeholder="All Status" 
            />
          </div>
          <AppButton
            variant="ghost"
            size="sm"
            class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
            @click="resetFilters"
          >
            Clear Filters
          </AppButton>
        </div>
      </AppCard>

      <!-- Data Table -->
      <AppCard class="overflow-hidden border-none shadow-premium">
        <AppTable
          :columns="columns"
          :rows="filteredContributions"
          row-key="id"
          class="!border-none"
        >
          <template #cell:date="{ value }">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-900">{{ value }}</span>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recorded</span>
            </div>
          </template>

          <template #cell:donor="{ row }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase group-hover:bg-white group-hover:border-violet-100 transition-all">
                {{ getInitials(row.contributorName) }}
              </div>
              <div>
                <p class="text-sm font-black text-slate-900 tracking-tight">
                  {{ row.contributorName || 'Anonymous' }}
                </p>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {{ row.contributorPhone }}
                </p>
              </div>
            </div>
          </template>

          <template #cell:assignment="{ row }">
            <div class="space-y-1">
              <p class="text-xs font-black text-slate-900 leading-tight">
                {{ row.event }}
              </p>
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ row.recipientFund }}</span>
              </div>
            </div>
          </template>

          <template #cell:collectorName="{ value }">
            <div
              v-if="value"
              class="flex items-center gap-2"
            >
              <div class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <User class="w-3.5 h-3.5" />
              </div>
              <span class="text-xs font-bold text-slate-600">{{ value }}</span>
            </div>
            <span
              v-else
              class="text-[10px] font-black text-slate-300 uppercase italic tracking-widest"
            >System</span>
          </template>

          <template #cell:method="{ row }">
            <div class="flex items-center gap-2">
              <component 
                :is="row.paymentMethod?.toLowerCase() === 'cash' ? Banknote : Smartphone" 
                class="w-4 h-4 text-slate-400" 
              />
              <span class="text-xs font-bold text-slate-900">{{ row.paymentMethod }}</span>
            </div>
          </template>

          <template #cell:amount="{ value, row }">
            <div class="flex flex-col items-end pr-4">
              <span class="text-sm font-black text-slate-900 tracking-tight">{{ value }}</span>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ row.currency }}</span>
            </div>
          </template>

          <template #cell:status="{ value }">
            <ContributionStatusBadge
              :status="String(value)"
              class="scale-90"
            />
          </template>

          <template #cell:actions="{ row }">
            <div class="flex items-center gap-2">
              <AppButton 
                v-if="row.receiptId"
                variant="ghost" 
                size="sm" 
                class="!p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                title="View Receipt"
                @click="router.push(`/collector/receipts/${row.receiptId}`)"
              >
                <FileText class="w-4 h-4" />
              </AppButton>
              <AppButton 
                variant="ghost" 
                size="sm" 
                class="!p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                @click="selectedContribution = row"
              >
                <Eye class="w-4 h-4" />
              </AppButton>
            </div>
          </template>
        </AppTable>
      </AppCard>

      <!-- Detail Drawer -->
      <DetailDrawer
        :is-open="!!selectedContribution"
        title="Contribution Audit"
        :subtitle="selectedContribution?.id"
        @close="selectedContribution = null"
      >
        <div
          v-if="selectedContribution"
          class="space-y-12"
        >
          <!-- Profile Header -->
          <section class="relative p-10 rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl flex flex-col items-center text-center">
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.5),transparent)]" />
            <div class="relative z-10 w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-6">
              {{ getInitials(selectedContribution.contributorName) }}
            </div>
            <h3 class="relative z-10 text-2xl font-black text-white tracking-tight">
              {{ selectedContribution.contributorName || 'Anonymous Donor' }}
            </h3>
            <p class="relative z-10 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
              {{ selectedContribution.contributorPhone }}
            </p>
            
            <div class="relative z-10 mt-8 text-5xl font-black text-white tracking-tighter">
              {{ selectedContribution.amount }}
            </div>
            <ContributionStatusBadge
              :status="selectedContribution.status"
              class="relative z-10 mt-6 scale-110"
            />
          </section>

          <!-- Contribution Metadata -->
          <div class="grid grid-cols-2 gap-y-10 gap-x-8">
            <div
              v-for="item in detailItems"
              :key="item.label"
            >
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                {{ item.label }}
              </h4>
              <p class="text-sm font-bold text-slate-900 tracking-tight">
                {{ item.value }}
              </p>
            </div>
          </div>

          <!-- Audit Log / Status Timeline -->
          <section class="p-8 rounded-3xl bg-slate-50 border border-slate-100">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
              Transaction Audit
            </h4>
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Plus class="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900">
                    Recorded via Collector Terminal
                  </p>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {{ selectedContribution.date }}
                  </p>
                </div>
              </div>
              <div
                v-if="selectedContribution.receiptId"
                class="flex items-start gap-4"
              >
                <div class="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Check class="w-4 h-4 text-violet-500" />
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900">
                    Digital Receipt Issued
                  </p>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    ID: {{ selectedContribution.receiptId.slice(0, 8) }}...
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            v-if="selectedContribution.note"
            class="p-8 rounded-3xl bg-amber-50/50 border border-amber-100"
          >
            <h4 class="text-[10px] font-black uppercase tracking-widest text-amber-600/50 mb-3">
              Donor Note
            </h4>
            <p class="text-sm text-amber-900/70 font-medium italic">
              "{{ selectedContribution.note }}"
            </p>
          </section>
        </div>

        <template #actions>
          <AppButton 
            v-if="selectedContribution?.receiptId"
            variant="outline"
            class="flex-1 !rounded-2xl !py-4"
            @click="router.push(`/collector/receipts/${selectedContribution.receiptId}`)"
          >
            <FileText class="w-4 h-4 mr-2" /> View Receipt
          </AppButton>
          <AppButton
            class="flex-1 !rounded-2xl !py-4"
            variant="primary"
          >
            <Download class="w-4 h-4 mr-2" /> Download PDF
          </AppButton>
        </template>
      </DetailDrawer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useContributions } from '../composables/useContributions'
import type { ContributionRow } from '../types/contribution'
import ContributionStatusBadge from '../components/ContributionStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import { formatCurrency } from '@/shared/utils/formatters'
import { 
  Download, 
  Eye,
  FileText,
  Search,
  Banknote,
  Smartphone,
  User,
  Plus,
  Check
} from 'lucide-vue-next'

const router = useRouter()
const query = useContributions()
const selectedContribution = ref<ContributionRow | null>(null)

const filters = reactive({
  search: '',
  method: '',
  status: ''
})

const columns = [
  { key: 'date', label: 'Date/Time' },
  { key: 'donor', label: 'Donor' },
  { key: 'assignment', label: 'Assignment' },
  { key: 'collectorName', label: 'Collector' },
  { key: 'method', label: 'Method' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
  { key: 'actions', label: '' },
]

const methodOptions = [
  { label: 'All Methods', value: '' },
  { label: 'Cash', value: 'Cash' },
  { label: 'Mobile Money', value: 'Momo' },
  { label: 'Card', value: 'Card' }
]

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' }
]

const filteredContributions = computed<ContributionRow[]>(() => {
  let list = (query.data.value ?? []) as ContributionRow[]
  
  if (filters.search) {
    const s = filters.search.toLowerCase()
    list = list.filter(c => 
      c.contributorName.toLowerCase().includes(s) || 
      c.contributorPhone.includes(s) ||
      c.id.toLowerCase().includes(s) ||
      c.receiptId?.toLowerCase().includes(s)
    )
  }
  
  if (filters.method) {
    list = list.filter(c => c.paymentMethod?.toLowerCase() === filters.method.toLowerCase())
  }
  
  if (filters.status) {
    list = list.filter(c => c.status?.toLowerCase() === filters.status.toLowerCase())
  }
  
  return list
})

const stats = computed(() => {
  const all = (query.data.value ?? []) as ContributionRow[]
  const total = all.reduce((acc, c) => acc + (c.amountValue || 0), 0)
  
  // Method breakdown
  const methods = ['Cash', 'Momo', 'Card'].map(m => {
    const count = all.filter(c => c.paymentMethod?.toLowerCase() === m.toLowerCase()).length
    return {
      label: m,
      percentage: all.length > 0 ? Math.round((count / all.length) * 100) : 0
    }
  }).sort((a, b) => b.percentage - a.percentage)

  return {
    total,
    monthly: total * 0.45, // Mock monthly for now until time-based filtering added
    average: all.length > 0 ? total / all.length : 0,
    failedCount: all.filter(c => c.status?.toLowerCase() === 'failed').length,
    pendingReceiptsCount: all.filter(c => !c.receiptId && c.status?.toLowerCase() === 'completed').length,
    methods
  }
})

const detailItems = computed(() => {
  if (!selectedContribution.value) return []
  const c = selectedContribution.value
  return [
    { label: 'Target Event', value: c.event },
    { label: 'Recipient Fund', value: c.recipientFund },
    { label: 'Payment Method', value: c.paymentMethod },
    { label: 'Recorded By', value: c.collectorName || 'System' },
    { label: 'Transaction ID', value: c.id.slice(0, 18) + '...' },
    { label: 'Reference', value: 'N/A' },
  ]
})

function resetFilters() {
  filters.search = ''
  filters.method = ''
  filters.status = ''
}

function getInitials(name?: string) {
  if (!name || name.toLowerCase() === 'anonymous') return 'AN'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
