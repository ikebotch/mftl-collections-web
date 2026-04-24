<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Events"
      description="Manage campaigns, recipient funds, collectors, and public contribution links."
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="!rounded-xl bg-white shadow-sm border-slate-200"
          >
            <Download class="w-4 h-4 mr-2 text-slate-400" />
            Export Data
          </AppButton>
          <AppButton
            variant="primary"
            class="!rounded-xl shadow-premium"
            @click="router.push('/admin/events/new')"
          >
            <Plus class="w-4 h-4 mr-2" />
            New Event
          </AppButton>
        </div>
      </template>
    </AdminPageHeader>

    <AdminMetricGrid>
      <MetricCard
        label="Operational Events"
        :value="events.length.toString()"
        icon="Calendar"
        color="purple"
      />
      <MetricCard
        label="Total Raised"
        :value="formatCurrency(totalRaised, 'GHS')"
        icon="Wallet"
        color="green"
      />
      <MetricCard
        label="Active Funds"
        :value="totalFunds.toString()"
        icon="Target"
        color="blue"
      />
      <MetricCard
        label="Total Collectors"
        :value="totalCollectors.toString()"
        icon="Users"
        color="amber"
      />
    </AdminMetricGrid>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search events by title or slug..."
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
        :rows="filteredEvents"
        :loading="query.isLoading.value"
        expandable
        @retry="query.refetch"
      >
        <template #cell:title="{ value, row }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-white group-hover:border-violet-100 transition-all">
              <Calendar class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-black text-slate-900 truncate tracking-tight">
                {{ value }}
              </p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {{ row.eventDate ? formatDate(row.eventDate) : 'No date' }} · /give/{{ row.slug }}
              </p>
            </div>
          </div>
        </template>

        <template #cell:totalRaised="{ value }">
          <MoneyCell
            :amount="value"
            currency="GHS"
            class="font-black"
          />
        </template>

        <template #cell:fundCount="{ value }">
          <span class="text-xs font-bold text-slate-600">{{ value }} Funds</span>
        </template>

        <template #cell:collectorCount="{ value }">
          <span class="text-xs font-bold text-slate-600">{{ value }} Collectors</span>
        </template>

        <template #cell:status="{ value }">
          <StatusBadge
            :status="value"
            :tone="value === 'active' ? 'success' : 'neutral'"
          />
        </template>

        <template #rowActions="{ row }">
          <RowActions
            :actions="[
              { label: 'View Details', icon: 'Eye', onClick: () => router.push(`/admin/events/${row.id}`) },
              { label: 'Edit Event', icon: 'Edit3', onClick: () => router.push(`/admin/events/${row.id}/edit`) },
              { label: 'Manage Funds', icon: 'Target', onClick: () => router.push(`/admin/events/${row.id}/recipient-funds`) },
              { label: 'Copy Link', icon: 'Link2', onClick: () => copyPublicLink(row.slug) }
            ]"
          />
        </template>

        <template #expansion="{ row }">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Fund Distribution
              </h4>
              <AppButton
                variant="ghost"
                size="xs"
                class="text-[9px] font-black uppercase tracking-widest"
                @click="router.push(`/admin/events/${row.id}/recipient-funds`)"
              >
                View All Funds
              </AppButton>
            </div>
            <EventRecipientFundsList :event-id="row.id" />
            
            <div
              v-if="row.totalRaised === 0"
              class="pt-4 border-t border-slate-50 mt-4"
            >
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                No contribution data yet
              </p>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '../composables/useEvents'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import MoneyCell from '@/shared/components/tables/MoneyCell.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import EventRecipientFundsList from '../components/EventRecipientFundsList.vue'
import { formatDate, formatCurrency } from '@/shared/utils/formatters'
import { 
  Plus, 
  Download, 
  Calendar 
} from 'lucide-vue-next'

const router = useRouter()
const query = useEvents()

const searchQuery = ref('')
const statusFilter = ref('')

const columns = [
  { key: 'title', label: 'Event', sortable: true },
  { key: 'totalRaised', label: 'Raised', sortable: true },
  { key: 'fundCount', label: 'Funds' },
  { key: 'collectorCount', label: 'Collectors' },
  { key: 'status', label: 'Status' },
]

const events = computed(() => query.data.value ?? [])

const filteredEvents = computed(() => {
  let list = events.value
  
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(e => 
      e.title.toLowerCase().includes(s) || 
      (e.slug && e.slug.toLowerCase().includes(s))
    )
  }
  
  if (statusFilter.value) {
    list = list.filter(e => e.status === statusFilter.value)
  }
  
  return list
})

const totalRaised = computed(() => {
  return events.value.reduce((acc, e) => acc + (e.totalRaised || 0), 0)
})

const totalFunds = computed(() => {
  return events.value.reduce((acc, e) => acc + (e.fundCount || 0), 0)
})

const totalCollectors = computed(() => {
  return events.value.reduce((acc, e) => acc + (e.collectorCount || 0), 0)
})

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
]

function copyPublicLink(slug: string) {
  const url = `${window.location.origin}/give/${slug}`
  navigator.clipboard.writeText(url)
}
</script>
