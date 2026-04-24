<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-display tracking-tight text-slate-900">
          Contributions
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          Real-time feed of all financial contributions across your platform.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <AppButton variant="outline" class="hidden sm:flex">
          <Download class="w-4 h-4 mr-2" />
          Export Report
        </AppButton>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        label="Total Raised"
        :value="formatCurrency(stats.total, 'GHS')"
        icon="Wallet"
        color="green"
        trend="+12%"
      />
      <MetricCard
        label="This Month"
        :value="formatCurrency(stats.monthly, 'GHS')"
        icon="Calendar"
        color="purple"
      />
      <MetricCard
        label="Average Gift"
        :value="formatCurrency(stats.average, 'GHS')"
        icon="TrendingUp"
        color="blue"
      />
      <MetricCard
        label="Pending Sync"
        value="0"
        icon="RefreshCw"
        color="amber"
      />
    </div>

    <!-- Filters -->
    <AppCard class="!p-6 border-none shadow-soft">
       <div class="flex flex-wrap items-center gap-4">
         <div class="flex-1 min-w-[240px]">
           <AppInput 
             v-model="filters.search" 
             placeholder="Search donor name or phone..." 
           />
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
         <AppButton variant="ghost" size="sm" @click="resetFilters">Reset</AppButton>
       </div>
    </AppCard>

    <AppCard class="overflow-hidden">
      <AppTable
        :columns="columns"
        :rows="filteredContributions"
        row-key="id"
      >
        <template #cell:donor="{ row }">
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
               {{ getInitials(row.contributorName) }}
             </div>
             <div>
               <p class="text-sm font-bold text-slate-900">{{ row.contributorName || 'Anonymous' }}</p>
               <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ row.contributorPhone }}</p>
             </div>
          </div>
        </template>

        <template #cell:amount="{ value }">
           <div class="font-black text-slate-900">
             {{ value }}
           </div>
        </template>

        <template #cell:status="{ value }">
          <ContributionStatusBadge :status="String(value)" />
        </template>

        <template #cell:actions="{ row }">
           <AppButton 
             variant="ghost" 
             size="sm" 
             @click="selectedContribution = row"
           >
             <Eye class="w-4 h-4" />
           </AppButton>
        </template>
      </AppTable>
    </AppCard>

    <DetailDrawer
      :is-open="!!selectedContribution"
      title="Contribution Details"
      :subtitle="selectedContribution?.id"
      @close="selectedContribution = null"
    >
      <div v-if="selectedContribution" class="space-y-10">
        <section class="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-full bg-white flex items-center justify-center text-2xl font-black text-slate-900 shadow-premium mb-4">
             {{ getInitials(selectedContribution.contributorName) }}
          </div>
          <h3 class="text-xl font-bold text-slate-900">{{ selectedContribution.contributorName || 'Anonymous Donor' }}</h3>
          <p class="text-slate-500 font-medium mt-1">{{ selectedContribution.contributorPhone }}</p>
          
          <div class="mt-8 text-4xl font-black text-slate-900">
            {{ selectedContribution.amount }}
          </div>
          <ContributionStatusBadge :status="selectedContribution.status" class="mt-4 scale-110" />
        </section>

        <div class="grid grid-cols-2 gap-y-10 gap-x-8">
          <div>
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Event</h4>
            <p class="font-bold text-slate-900">{{ selectedContribution.event }}</p>
          </div>
          <div>
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Recipient Fund</h4>
            <p class="font-bold text-slate-900">{{ selectedContribution.recipientFund }}</p>
          </div>
          <div>
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Method</h4>
            <p class="font-bold text-slate-900">{{ selectedContribution.paymentMethod }}</p>
          </div>
          <div>
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Date</h4>
            <p class="font-bold text-slate-900">{{ selectedContribution.date }}</p>
          </div>
        </div>

        <section v-if="selectedContribution.note" class="p-6 rounded-xl border border-slate-100 bg-slate-50/50">
           <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Note</h4>
           <p class="text-sm text-slate-600 font-medium italic">"{{ selectedContribution.note }}"</p>
        </section>
      </div>

      <template #actions>
        <AppButton class="flex-1" variant="outline">
          <FileText class="w-4 h-4 mr-2" />
          View Receipt
        </AppButton>
        <AppButton class="flex-1" variant="primary">
          <Mail class="w-4 h-4 mr-2" />
          Resend Receipt
        </AppButton>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
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
import { formatCurrency } from '@/shared/utils/formatters'
import { 
  Download, 
  Wallet, 
  Calendar, 
  TrendingUp, 
  RefreshCw,
  Eye,
  FileText,
  Mail
} from 'lucide-vue-next'

const query = useContributions()
const selectedContribution = ref<ContributionRow | null>(null)

const filters = reactive({
  search: '',
  method: '',
  status: ''
})

const columns = [
  { key: 'donor', label: 'Donor' },
  { key: 'event', label: 'Event' },
  { key: 'recipientFund', label: 'Fund' },
  { key: 'paymentMethod', label: 'Method' },
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

const filteredContributions = computed(() => {
  let list = query.data.value ?? []
  
  if (filters.search) {
    const s = filters.search.toLowerCase()
    list = list.filter(c => 
      c.contributorName.toLowerCase().includes(s) || 
      c.contributorPhone.includes(s)
    )
  }
  
  if (filters.method) {
    list = list.filter(c => c.paymentMethod === filters.method)
  }
  
  if (filters.status) {
    list = list.filter(c => c.status === filters.status)
  }
  
  return list
})

const stats = computed(() => {
  const all = query.data.value ?? []
  const total = all.reduce((acc, c) => acc + (c.amountValue || 0), 0)
  return {
    total,
    monthly: total * 0.4, // Mock monthly for now
    average: all.length > 0 ? total / all.length : 0
  }
})

function resetFilters() {
  filters.search = ''
  filters.method = ''
  filters.status = ''
}

function getInitials(name?: string) {
  if (!name) return 'AN'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
