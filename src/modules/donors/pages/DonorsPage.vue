<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-display tracking-tight text-slate-900">
          Donor Intelligence
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          Identify and manage your most impactful contributors.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <AppButton variant="outline">
          <Download class="w-4 h-4 mr-2" />
          Export Donors
        </AppButton>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        label="Total Donors"
        :value="query.data.value?.length.toString() ?? '0'"
        icon="Users"
        color="purple"
      />
      <MetricCard
        label="New This Month"
        value="0"
        icon="UserPlus"
        color="green"
      />
      <MetricCard
        label="Repeat Donors"
        :value="repeatDonorsCount.toString()"
        icon="RefreshCw"
        color="blue"
      />
      <MetricCard
        label="Avg. Lifetime Value"
        :value="formatCurrency(avgLtv, 'GHS')"
        icon="TrendingUp"
        color="amber"
      />
    </div>

    <AppCard class="overflow-hidden">
      <AppTable
        :columns="columns"
        :rows="query.data.value ?? []"
        row-key="id"
      >
        <template #cell:donor="{ row }">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100">
               {{ getInitials(row.name) }}
             </div>
             <div>
               <p class="text-sm font-bold text-slate-900">{{ row.name }}</p>
               <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ row.phone }}</p>
             </div>
          </div>
        </template>

        <template #cell:totalGiven="{ value }">
           <div class="font-black text-slate-900">
             {{ formatCurrency(value, 'GHS') }}
           </div>
        </template>

        <template #cell:donationCount="{ value }">
          <div class="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
            {{ value }} {{ value === 1 ? 'Gift' : 'Gifts' }}
          </div>
        </template>

        <template #cell:lastDonationAt="{ value }">
          <p class="text-sm text-slate-600 font-medium">{{ formatDate(value) }}</p>
        </template>

        <template #cell:actions="{ row }">
           <AppButton variant="ghost" size="sm" @click="selectedDonor = row">
             <Eye class="w-4 h-4" />
           </AppButton>
        </template>
      </AppTable>
    </AppCard>

    <DetailDrawer
      :is-open="!!selectedDonor"
      title="Donor Profile"
      subtitle="Donor Intelligence"
      @close="selectedDonor = null"
    >
      <div v-if="selectedDonor" class="space-y-10">
        <section class="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-2xl font-black text-slate-900 shadow-premium mb-4">
             {{ getInitials(selectedDonor.name) }}
          </div>
          <h3 class="text-xl font-bold text-slate-900">{{ selectedDonor.name }}</h3>
          <p class="text-slate-500 font-medium">{{ selectedDonor.phone }}</p>
          <p class="text-xs text-slate-400 mt-1">{{ selectedDonor.email || 'No email provided' }}</p>
        </section>

        <div class="grid grid-cols-2 gap-8">
           <div class="p-4 rounded-xl border border-slate-100">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lifetime Value</h4>
              <p class="text-2xl font-black text-slate-900">{{ formatCurrency(selectedDonor.totalGiven, 'GHS') }}</p>
           </div>
           <div class="p-4 rounded-xl border border-slate-100">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Gifts</h4>
              <p class="text-2xl font-black text-slate-900">{{ selectedDonor.donationCount }}</p>
           </div>
        </div>

        <section>
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Donation History</h4>
          <div class="space-y-3">
             <!-- Since we don't have filtered history here yet, we just show a placeholder or brief note -->
             <p class="text-sm text-slate-500 italic">Historical breakdown available in Contributions dashboard.</p>
          </div>
        </section>
      </div>

      <template #actions>
        <AppButton class="flex-1" variant="outline">
          <Mail class="w-4 h-4 mr-2" />
          Email Donor
        </AppButton>
        <AppButton class="flex-1" variant="secondary" @click="selectedDonor = null">
          Close Profile
        </AppButton>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDonors } from '../composables/useDonors'
import type { Donor } from '../types/donor'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'
import { 
  Download, 
  Users, 
  UserPlus, 
  RefreshCw, 
  TrendingUp,
  Eye,
  Mail
} from 'lucide-vue-next'

const query = useDonors()
const selectedDonor = ref<Donor | null>(null)

const columns = [
  { key: 'donor', label: 'Donor' },
  { key: 'donationCount', label: 'Frequency' },
  { key: 'totalGiven', label: 'Lifetime Value' },
  { key: 'lastDonationAt', label: 'Last Gift' },
  { key: 'actions', label: '' },
]

const repeatDonorsCount = computed(() => {
  return (query.data.value ?? []).filter(d => d.donationCount > 1).length
})

const avgLtv = computed(() => {
  const all = query.data.value ?? []
  if (all.length === 0) return 0
  const total = all.reduce((acc, d) => acc + d.totalGiven, 0)
  return total / all.length
})

function getInitials(name?: string) {
  if (!name) return 'AN'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
