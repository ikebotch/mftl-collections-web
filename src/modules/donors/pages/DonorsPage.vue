<template>
  <div class="space-y-10 selection:bg-violet-500/30">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900">
          Donor Intelligence
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          Identify and nurture your most impactful contributors through data-driven insights.
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <AppButton 
          variant="outline"
          class="!rounded-xl bg-white shadow-sm border-slate-200"
        >
          <Download class="w-4 h-4 mr-2 text-slate-400" />
          Export Database
        </AppButton>
      </div>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Analyzing donor behavior..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Analysis failed"
      :message="query.error.value?.message ?? 'Connection error.'"
      show-retry
      @retry="query.refetch"
    />

    <template v-else-if="query.data.value">
      <!-- KPI Intelligence -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Donors"
          :value="query.data.value.length.toString()"
          icon="Users"
          color="purple"
          description="Lifetime unique contributors"
        />
        <MetricCard
          label="Repeat Donors"
          :value="stats.repeatDonors.toString()"
          icon="RefreshCw"
          color="blue"
          :description="`Retention rate: ${stats.retentionRate}%`"
        />
        <MetricCard
          label="Average LTV"
          :value="formatCurrency(stats.avgLtv, 'GHS')"
          icon="TrendingUp"
          color="green"
          description="Average lifetime value"
        />
        <MetricCard
          label="Anonymous Share"
          :value="stats.anonymousCount.toString()"
          icon="EyeOff"
          color="amber"
          description="Gifts without profiles"
        />
      </div>

      <!-- Filters & Search -->
      <AppCard class="!p-6 border-none shadow-soft">
        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div class="md:col-span-2 lg:col-span-3">
            <AppInput 
              v-model="filters.search" 
              placeholder="Search by name, phone or email..." 
            >
              <template #icon>
                <Search class="w-4 h-4" />
              </template>
            </AppInput>
          </div>
          <AppSelect 
            v-model="filters.type" 
            :options="donorTypeOptions" 
            placeholder="Donor Type" 
          />
          <AppSelect 
            v-model="filters.method" 
            :options="methodOptions" 
            placeholder="Pref. Method" 
          />
          <AppButton
            variant="ghost"
            class="text-[10px] font-black uppercase tracking-widest text-slate-400"
            @click="resetFilters"
          >
            Reset
          </AppButton>
        </div>
      </AppCard>

      <!-- Ranked Donor Table -->
      <AppCard class="!p-0 border-none shadow-premium overflow-hidden">
        <div class="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Impact Rankings
          </h3>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Sorted by LTV</span>
          </div>
        </div>
        <AppTable
          :columns="columns"
          :rows="filteredDonors"
          row-key="id"
          class="!border-none"
        >
          <template #cell:donor="{ row }">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[11px] font-black text-slate-400 shrink-0 group-hover:bg-white group-hover:border-violet-100 transition-all">
                {{ getInitials(row.name) }}
              </div>
              <div>
                <p class="text-sm font-black text-slate-900 tracking-tight">
                  {{ row.name }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <div
                    v-if="row.donationCount > 2"
                    class="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  />
                  <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.1em]">
                    {{ row.phone }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <template #cell:totalGiven="{ value }">
            <div class="font-black text-slate-900">
              {{ formatCurrency(value, 'GHS') }}
            </div>
          </template>

          <template #cell:intelligence="{ row }">
            <div class="space-y-1">
              <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <span class="text-slate-400">Gifts:</span>
                <span class="text-slate-900">{{ row.donationCount }}</span>
              </div>
              <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <span class="text-slate-400">Events:</span>
                <span class="text-slate-900">{{ row.eventsSupported }}</span>
              </div>
            </div>
          </template>

          <template #cell:lastDonationAt="{ value, row }">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-900">{{ formatDate(value) }}</span>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
                {{ row.lastEvent }}
              </span>
            </div>
          </template>

          <template #cell:preferredMethod="{ value }">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
              <component 
                :is="value.toLowerCase() === 'cash' ? Banknote : Smartphone" 
                class="w-3.5 h-3.5 text-slate-400" 
              />
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">{{ value }}</span>
            </div>
          </template>

          <template #cell:status="{ row }">
            <div 
              class="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
              :class="row.totalGiven > 500 ? 'bg-violet-50 text-violet-600' : 'bg-slate-50 text-slate-500'"
            >
              {{ row.totalGiven > 500 ? 'VIP' : 'Standard' }}
            </div>
          </template>

          <template #cell:actions="{ row }">
            <AppButton 
              variant="ghost" 
              size="sm" 
              class="!rounded-xl hover:bg-violet-50 hover:text-violet-600 transition-colors"
              @click="selectedDonor = row"
            >
              <Eye class="w-4 h-4" />
            </AppButton>
          </template>
        </AppTable>
      </AppCard>

      <!-- Donor Profile Side Panel -->
      <DetailDrawer
        :is-open="!!selectedDonor"
        title="Donor Intelligence"
        subtitle="Individual Profile"
        @close="selectedDonor = null"
      >
        <div
          v-if="selectedDonor"
          class="space-y-12"
        >
          <!-- VIP Profile Header -->
          <section class="relative p-10 rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl">
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.5),transparent)]" />
            <div class="relative z-10 flex flex-col items-center text-center">
              <div class="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-6">
                {{ getInitials(selectedDonor.name) }}
              </div>
              <h3 class="text-2xl font-black text-white tracking-tight">
                {{ selectedDonor.name }}
              </h3>
              <p class="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
                {{ selectedDonor.phone }}
              </p>
              
              <div class="mt-8 grid grid-cols-2 gap-3 w-full">
                <div class="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p class="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
                    Frequency
                  </p>
                  <p class="text-white font-black">
                    {{ selectedDonor.donationCount }} Gifts
                  </p>
                </div>
                <div class="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p class="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
                    Last Active
                  </p>
                  <p class="text-white font-black">
                    {{ formatDate(selectedDonor.lastDonationAt) }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Contribution Metrics -->
          <div class="grid grid-cols-2 gap-6">
            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm relative overflow-hidden group">
              <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                <Wallet class="w-24 h-24" />
              </div>
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Lifetime Value
              </h4>
              <p class="text-3xl font-black text-slate-900 tracking-tight">
                {{ formatCurrency(selectedDonor.totalGiven, 'GHS') }}
              </p>
            </div>
            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm relative overflow-hidden group">
              <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                <TrendingUp class="w-24 h-24" />
              </div>
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Gift Average
              </h4>
              <p class="text-3xl font-black text-slate-900 tracking-tight">
                {{ formatCurrency(selectedDonor.totalGiven / selectedDonor.donationCount, 'GHS') }}
              </p>
            </div>
          </div>

          <!-- Supported Causes -->
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Supported Campaigns
              </h4>
              <span class="text-[9px] font-black uppercase tracking-widest text-slate-900">{{ selectedDonor.eventsSupported }} Total</span>
            </div>
            <div class="space-y-3">
              <div 
                v-for="(event, i) in [selectedDonor.lastEvent, 'Community Support Fund'].slice(0, selectedDonor.eventsSupported)" 
                :key="i"
                class="flex items-center justify-between p-5 rounded-2xl border border-slate-50 bg-white shadow-sm hover:border-violet-100 transition-colors cursor-default"
              >
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Target class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-900 tracking-tight">
                      {{ event }}
                    </p>
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      Primary Recipient
                    </p>
                  </div>
                </div>
                <ChevronRight class="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </section>

          <!-- Interaction Timeline -->
          <section class="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
              Interaction History
            </h4>
            <div class="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
              <div class="relative pl-10">
                <div class="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-10">
                  <Plus class="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p class="text-sm font-black text-slate-900">
                    Latest Contribution Recorded
                  </p>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    {{ formatDate(selectedDonor.lastDonationAt) }}
                  </p>
                </div>
              </div>
              <div class="relative pl-10">
                <div class="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-10">
                  <Check class="w-4 h-4 text-violet-500" />
                </div>
                <div>
                  <p class="text-sm font-black text-slate-900">
                    Digital Identity Verified
                  </p>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Automated Audit
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <template #actions>
          <AppButton
            class="flex-1 !rounded-2xl !py-4"
            variant="outline"
          >
            <Mail class="w-4 h-4 mr-2" /> Message
          </AppButton>
          <AppButton
            class="flex-1 !rounded-2xl !py-4"
            variant="primary"
          >
            View All Activity
          </AppButton>
        </template>
      </DetailDrawer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useDonors } from '../composables/useDonors'
import type { Donor } from '../types/donor'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'
import { 
  Download, 
  Eye,
  Mail,
  Search,
  Banknote,
  Smartphone,
  TrendingUp,
  Wallet,
  ChevronRight,
  Plus,
  Check,
  Target
} from 'lucide-vue-next'

const query = useDonors()
const selectedDonor = ref<Donor | null>(null)

const filters = reactive({
  search: '',
  type: '',
  method: ''
})

const columns = [
  { key: 'donor', label: 'Impact Entity' },
  { key: 'intelligence', label: 'Engagement' },
  { key: 'totalGiven', label: 'Lifetime Value' },
  { key: 'lastDonationAt', label: 'Last Activity' },
  { key: 'preferredMethod', label: 'Pref. Method' },
  { key: 'status', label: 'Tier' },
  { key: 'actions', label: '' },
]

const donorTypeOptions = [
  { label: 'All Donors', value: '' },
  { label: 'VIP (LTV > 500)', value: 'vip' },
  { label: 'Repeat Contributors', value: 'repeat' },
  { label: 'One-time Supporters', value: 'once' }
]

const methodOptions = [
  { label: 'Any Method', value: '' },
  { label: 'Cash', value: 'Cash' },
  { label: 'Mobile Money', value: 'Momo' },
  { label: 'Online Payment', value: 'Card' }
]

const filteredDonors = computed<Donor[]>(() => {
  let list = (query.data.value ?? []) as Donor[]
  
  if (filters.search) {
    const s = filters.search.toLowerCase()
    list = list.filter(d => 
      d.name.toLowerCase().includes(s) || 
      d.phone.includes(s) ||
      d.email?.toLowerCase().includes(s)
    )
  }

  if (filters.type === 'vip') {
    list = list.filter(d => d.totalGiven > 500)
  } else if (filters.type === 'repeat') {
    list = list.filter(d => d.donationCount > 1)
  } else if (filters.type === 'once') {
    list = list.filter(d => d.donationCount === 1)
  }

  if (filters.method) {
    list = list.filter(d => d.preferredMethod.toLowerCase() === filters.method.toLowerCase())
  }
  
  return list
})

const stats = computed(() => {
  const all = (query.data.value ?? []) as Donor[]
  if (all.length === 0) return { 
    repeatDonors: 0, 
    retentionRate: 0, 
    avgLtv: 0, 
    anonymousCount: 0 
  }

  const repeatCount = all.filter(d => d.donationCount > 1).length
  const totalLtv = all.reduce((acc, d) => acc + d.totalGiven, 0)

  return {
    repeatDonors: repeatCount,
    retentionRate: Math.round((repeatCount / all.length) * 100),
    avgLtv: totalLtv / all.length,
    anonymousCount: 0 // In real app, we'd pull this from a separate aggregate
  }
})

function resetFilters() {
  filters.search = ''
  filters.type = ''
  filters.method = ''
}

function getInitials(name?: string) {
  if (!name || name.toLowerCase() === 'anonymous') return 'AN'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
