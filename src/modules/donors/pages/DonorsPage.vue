<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-display tracking-tight text-slate-900">
          Supporters & Donors
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          View and manage the people supporting your causes.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <AppButton
          variant="outline"
          class="hidden sm:flex"
        >
          <Download class="w-4 h-4 mr-2" />
          Export Donors
        </AppButton>
        <AppButton 
          variant="primary"
        >
          <Mail class="w-4 h-4 mr-2" />
          Bulk Message
        </AppButton>
      </div>
    </div>

    <!-- KPI Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Donors"
        value="128"
        icon="Users"
        trend="+12 this month"
      />
      <MetricCard
        label="New Supporters"
        value="15"
        icon="UserPlus"
        color="green"
      />
      <MetricCard
        label="Avg. Lifetime Value"
        value="GHS 420"
        icon="TrendingUp"
      />
      <MetricCard
        label="Repeat Donors"
        value="42%"
        icon="Repeat"
      />
    </div>

    <!-- Smart Filter Toolbar -->
    <AppToolbar>
      <AppInput
        id="donor-search"
        model-value=""
        label="Search"
        placeholder="Name, email, phone..."
      />
      <AppSelect
        id="donor-type"
        model-value=""
        label="Donor Type"
        :options="[{ label: 'All', value: '' }, { label: 'Individual', value: 'individual' }, { label: 'Organization', value: 'org' }]"
      />
      <template #actions>
        <AppButton
          variant="secondary"
          size="sm"
        >
          Reset
        </AppButton>
      </template>
    </AppToolbar>

    <LoadingState
      v-if="query.isLoading.value"
      text="Deriving donor insights..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Failed to load donor data"
      :message="query.error.value?.message ?? 'Retry sync.'"
      @retry="query.refetch"
    />
    <EmptyState
      v-else-if="!donors.length"
      title="No donors found"
      description="Donors appear here automatically when they contribute to your events."
    />

    <AppCard
      v-else
      class="overflow-hidden"
    >
      <AppTable
        :columns="columns"
        :rows="donors"
        row-key="id"
      >
        <template #cell:name="{ value, row }">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shrink-0">
              <User class="w-6 h-6" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold text-slate-900 truncate">
                {{ value }}
              </p>
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                {{ row.email || 'No contact provided' }}
              </p>
            </div>
          </div>
        </template>

        <template #cell:totalGiven="{ value }">
          <span class="font-black text-slate-900">{{ formatCurrency(value, 'GHS') }}</span>
        </template>

        <template #cell:actions="{ row }">
          <AppButton
            variant="secondary"
            size="sm"
            @click="openDetail(row)"
          >
            History
          </AppButton>
        </template>
      </AppTable>
    </AppCard>

    <div class="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl">
      <span class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Donor profiles are derived from receipt history - Backend API Pending</span>
    </div>

    <!-- Detail Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Donor Profile"
      :subtitle="selectedDonor?.name"
      @close="isDrawerOpen = false"
    >
      <div
        v-if="selectedDonor"
        class="space-y-8"
      >
        <div class="flex flex-col items-center py-8 bg-slate-50 rounded-3xl border border-slate-100">
          <div class="w-24 h-24 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-300 mb-4 font-display text-2xl font-black">
            {{ selectedDonor.name.charAt(0) }}
          </div>
          <h3 class="text-xl font-bold text-slate-900">
            {{ selectedDonor.name }}
          </h3>
          <p class="text-sm font-medium text-slate-500">
            {{ selectedDonor.email || 'No email' }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-white border border-slate-100 rounded-2xl">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Total Given
            </p>
            <p class="text-lg font-black text-slate-900">
              {{ formatCurrency(selectedDonor.totalGiven, 'GHS') }}
            </p>
          </div>
          <div class="p-4 bg-white border border-slate-100 rounded-2xl">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Donations
            </p>
            <p class="text-lg font-black text-slate-900">
              {{ selectedDonor.count }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <SectionHeader
            title="Recent Activity"
            description="Last contributions from this donor."
          />
          <div class="space-y-2">
            <div 
              v-for="i in 3" 
              :key="i"
              class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
            >
              <div>
                <p class="text-sm font-bold text-slate-900">
                  GHS 100.00
                </p>
                <p class="text-[10px] font-bold text-slate-400 uppercase">
                  Community Support Event
                </p>
              </div>
              <span class="text-[10px] font-black text-slate-400 uppercase">12 Apr</span>
            </div>
          </div>
        </div>

        <div class="space-y-3 pt-6 border-t border-slate-100">
          <AppButton
            variant="outline"
            class="w-full"
          >
            <Download class="w-4 h-4 mr-2" />
            Tax Receipt History
          </AppButton>
          <AppButton
            variant="secondary"
            class="w-full"
          >
            <Mail class="w-4 h-4 mr-2" />
            Send Thank You
          </AppButton>
        </div>
      </div>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReceipts } from '@/modules/receipts/composables/useReceipts'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppToolbar from '@/shared/components/toolbars/AppToolbar.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import { formatCurrency } from '@/shared/utils/formatters'
import { 
  Download, 
  Mail, 
  User
} from 'lucide-vue-next'

const query = useReceipts()

const columns = [
  { key: 'name', label: 'Supporter' },
  { key: 'totalGiven', label: 'Total Contribution' },
  { key: 'count', label: 'Events Supported' },
  { key: 'lastDate', label: 'Last Donation' },
  { key: 'actions', label: '' },
]

// Derive donor data from receipts
const donors = computed(() => {
  if (!query.data.value) return []
  
  const donorMap = new Map<string, any>()
  
  query.data.value.forEach(receipt => {
    // In a real app, we'd use a DonorId or email. For now, name is the key.
    const key = receipt.contributorName || 'Anonymous'
    const existing = donorMap.get(key) || { 
      id: key, 
      name: key, 
      email: '', 
      totalGiven: 0, 
      count: 0, 
      lastDate: receipt.issuedAt 
    }
    
    existing.totalGiven += Number(receipt.amount)
    existing.count += 1
    if (new Date(receipt.issuedAt) > new Date(existing.lastDate)) {
      existing.lastDate = receipt.issuedAt
    }
    
    donorMap.set(key, existing)
  })
  
  return Array.from(donorMap.values())
})

const isDrawerOpen = ref(false)
const selectedDonor = ref<any>(null)

function openDetail(row: any) {
  selectedDonor.value = row
  isDrawerOpen.value = true
}
</script>
