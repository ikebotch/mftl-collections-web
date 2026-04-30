<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Donors"
      description="Understand contributor history, giving patterns, and receipt activity."
    />

    <AdminMetricGrid>
      <MetricCard
        label="Total Donors"
        :value="donors.length.toString()"
        icon="Users"
        color="slate"
      />
      <MetricCard
        label="New Donors"
        :value="donors.filter((d: Donor) => d.donationCount === 1).length.toString()"
        icon="UserPlus"
        color="green"
      />
      <MetricCard
        label="Repeat Donors"
        :value="donors.filter((d: Donor) => d.donationCount > 1).length.toString()"
        icon="Zap"
        color="purple"
      />
      <MetricCard
        label="Avg Yield"
        :value="avgYield"
        icon="TrendingUp"
        color="blue"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search donors by name, email or phone..."
      />

      <DataTable
        :columns="columns"
        :rows="filteredDonors"
        :loading="query.isLoading.value"
        exportable
        title="Donor Directory"
      >
        <template #cell:donor="{ row }">
          <button 
            class="flex flex-col text-left group/donor"
            @click="openDrawer(row)"
          >
            <span class="font-black text-slate-900 tracking-tight group-hover/donor:text-violet-600 transition-colors">{{ row.name }}</span>
            <span
              v-if="row.id.includes('-')"
              class="text-[10px] text-slate-400 font-bold uppercase tracking-widest"
            >{{ row.id.split('-')[0] }}</span>
          </button>
        </template>

        <template #cell:contact="{ row }">
          <div class="flex flex-col">
            <span class="text-xs font-bold text-slate-600">{{ row.phone || 'No phone' }}</span>
            <span class="text-[10px] text-slate-400 font-medium">{{ row.email || 'No email' }}</span>
          </div>
        </template>

        <template #cell:totalGiven="{ row }">
          <MoneyCell
            :amount="row.totalGiven"
            currency="GHS"
          />
        </template>

        <template #cell:lastDonation="{ row }">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ row.lastDonationAt }}</span>
        </template>

        <template #cell:eventsSupported="{ row }">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-slate-900">{{ row.eventsSupported }}</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Events</span>
          </div>
        </template>

        <template #cell:status="{ row }">
          <StatusBadge
            :status="row.status"
            :tone="row.status === 'active' ? 'success' : 'danger'"
          />
        </template>

        <template #rowActions="{ row }">
          <RowActions
            :actions="[
              { label: 'View Profile', icon: 'User', onClick: () => openDrawer(row) },
              { label: 'Export History', icon: 'Download', onClick: () => {} }
            ]"
          />
        </template>
      </DataTable>
    </div>

    <!-- Donor Detail Drawer -->
    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Donor Profile"
      :subtitle="selectedDonor?.name"
      @close="isDrawerOpen = false"
    >
      <div
        v-if="selectedDonor"
        class="space-y-10"
      >
        <section class="flex flex-col items-center text-center">
          <div class="w-24 h-24 rounded-none bg-slate-900 text-white flex items-center justify-center text-3xl font-black mb-6 shadow-premium">
            {{ selectedDonor.name.charAt(0) }}
          </div>
          <h3 class="text-2xl font-black text-slate-900">
            {{ selectedDonor.name }}
          </h3>
          <p class="text-slate-500 font-medium mt-1">
            {{ selectedDonor.email || selectedDonor.phone }}
          </p>
          <div class="mt-6 flex gap-3">
            <StatusBadge
              v-if="selectedDonor.totalGiven > 5000"
              status="VIP"
              tone="success"
            />
            <StatusBadge
              status="Active Contributor"
              tone="neutral"
            />
          </div>
        </section>

        <div class="grid grid-cols-2 gap-4">
          <AppCard class="!p-6 border-slate-100 bg-slate-50/50">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Given
            </p>
            <p class="text-xl font-black text-slate-900 tracking-tight">
              {{ formatCurrency(selectedDonor.totalGiven, 'GHS') }}
            </p>
          </AppCard>
          <AppCard class="!p-6 border-slate-100 bg-slate-50/50">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Contributions
            </p>
            <p class="text-xl font-black text-slate-900 tracking-tight">
              {{ selectedDonor.donationCount }}
            </p>
          </AppCard>
        </div>

        <section class="space-y-6 pt-6 border-t border-slate-100">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Giving Pattern
          </h4>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500">Average Contribution</span>
              <span class="text-xs font-black text-slate-900">{{ formatCurrency(selectedDonor.donationCount > 0 ? selectedDonor.totalGiven / selectedDonor.donationCount : 0, 'GHS') }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500">Preferred Method</span>
              <span class="text-xs font-black text-slate-900 uppercase tracking-widest">{{ selectedDonor.preferredMethod }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500">Last Contribution</span>
              <span class="text-xs font-black text-slate-900">{{ selectedDonor.lastDonationAt }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500">Last Event Supported</span>
              <span class="text-xs font-black text-slate-900">{{ selectedDonor.lastEvent }}</span>
            </div>
          </div>
        </section>

        <section class="space-y-4">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Recent Activity
          </h4>
          <div class="space-y-3">
            <div
              v-for="n in 3"
              :key="n"
              class="p-4 rounded-none border border-slate-100 bg-white flex items-center justify-between opacity-50"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center">
                  <FileText class="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900">
                    Contribution recorded
                  </p>
                  <p class="text-[10px] text-slate-400">
                    Historical data migration pending
                  </p>
                </div>
              </div>
              <ChevronRight class="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </section>
      </div>

      <template #actions>
        <AppButton
          variant="primary"
          class="flex-1 !rounded-none shadow-premium"
        >
          Send Thank-you Note
        </AppButton>
        <AppButton
          variant="outline"
          class="!rounded-none"
        >
          Export History
        </AppButton>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDonors } from '../composables/useDonors'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import MoneyCell from '@/shared/components/tables/MoneyCell.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { FileText, ChevronRight } from 'lucide-vue-next'
import type { Donor } from '../types/donor'

const searchQuery = ref('')
const query = useDonors()
const donors = computed<Donor[]>(() => query.data.value || ([] as Donor[]))

const avgYield = computed(() => {
  if (donors.value.length === 0) return 'GHS 0.00'
  const total = donors.value.reduce((acc: number, d: Donor) => acc + d.totalGiven, 0)
  return formatCurrency(total / donors.value.length, 'GHS')
})

const isDrawerOpen = ref(false)
const selectedDonor = ref<Donor | null>(null)

const columns = [
  { key: 'donor', label: 'Donor' },
  { key: 'contact', label: 'Contact' },
  { key: 'totalGiven', label: 'Total Given' },
  { key: 'lastDonation', label: 'Last Donation' },
  { key: 'eventsSupported', label: 'Events' },
  { key: 'status', label: 'Status' }
]

const filteredDonors = computed(() => {
  if (!searchQuery.value) return donors.value
  const q = searchQuery.value.toLowerCase()
  return donors.value.filter((d: Donor) => 
    d.name.toLowerCase().includes(q) || 
    (d.email && d.email.toLowerCase().includes(q)) || 
    d.phone.toLowerCase().includes(q)
  )
})

function openDrawer(row: Donor) {
  selectedDonor.value = row
  isDrawerOpen.value = true
}
</script>
