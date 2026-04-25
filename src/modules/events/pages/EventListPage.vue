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
        :value="aggregateTotals(events)"
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
        <template #cell:title="{ row }">
          <div class="flex items-center gap-5 group/item py-1">
            <div class="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden group-hover/item:border-violet-200 group-hover/item:shadow-soft transition-all duration-500">
              <img
                v-if="row.displayImageUrl"
                :src="row.displayImageUrl"
                class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
              >
              <div v-else class="w-full h-full bg-slate-50 flex items-center justify-center">
                <ImageIcon class="w-5 h-5 text-slate-300" />
              </div>
            </div>
            <div class="min-w-0">
              <p class="text-[15px] font-black text-slate-900 truncate tracking-tight leading-none mb-1.5">
                {{ row.title }}
              </p>
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-widest border border-slate-200/50">
                  /give/{{ row.slug }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <template #cell:totalRaised="{ row }">
          <div class="flex flex-col gap-1 py-1">
            <span
              v-for="t in row.totals"
              :key="t.currency"
              class="text-sm font-black text-slate-900 italic"
            >
              {{ formatCurrency(t.amount, t.currency) }}
            </span>
            <span
              v-if="!row.totals?.length"
              class="text-sm font-black text-slate-400 italic"
            >GHS 0.00</span>
          </div>
        </template>

        <template #cell:fundCount="{ value }">
          <div class="py-1">
            <span class="text-sm font-black text-slate-900 leading-none">{{ value || 0 }}</span>
          </div>
        </template>

        <template #cell:collectorCount="{ value }">
          <div class="py-1">
            <span class="text-sm font-black text-slate-900 leading-none">{{ value || 0 }}</span>
          </div>
        </template>

        <template #cell:status="{ value }">
          <div class="py-1">
            <StatusBadge
              :status="value"
              :tone="value === 'active' ? 'success' : 'neutral'"
              dot
            />
          </div>
        </template>

        <template #cell:dates="{ row }">
          <div class="flex flex-col gap-1 py-1">
            <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
              {{ row.eventDate ? formatDate(row.eventDate, 'MMM d, yyyy') : 'No date set' }}
            </span>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Operational Period
            </span>
          </div>
        </template>

        <template #rowActions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <AppButton
              variant="ghost"
              size="sm"
              class="!rounded-xl hover:bg-violet-50 hover:text-violet-600"
              @click="router.push(`/admin/events/${row.id}`)"
            >
              <Eye class="w-4 h-4" />
            </AppButton>
            <AppButton
              variant="ghost"
              size="sm"
              class="!rounded-xl hover:bg-slate-100"
              @click="copyPublicLink(row.slug)"
            >
              <Link2 class="w-4 h-4" />
            </AppButton>
            <RowActions
              :actions="[
                { label: 'Manage Funds', icon: 'Target', onClick: () => router.push(`/admin/events/${row.id}/recipient-funds`) },
                { label: 'View Analytics', icon: 'BarChart2', onClick: () => router.push(`/admin/events/${row.id}/analytics`) }
              ]"
            />
          </div>
        </template>

        <template #expansion="{ row }">
          <EventExpandedDetails :event-id="row.id" />
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
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import EventExpandedDetails from '../components/EventExpandedDetails.vue'
import { formatDate, formatCurrency } from '@/core/formatting/formatters'
import { 
  Plus, 
  Download, 
  Calendar,
  Image as ImageIcon,
  Eye,
  Link2,
  BarChart2
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
  { key: 'dates', label: 'Dates' },
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

function aggregateTotals(list: any[]) {
  const map: Record<string, number> = {}
  list.forEach(e => {
    e.totals?.forEach((t: any) => {
      map[t.currency] = (map[t.currency] || 0) + t.amount
    })
  })
  
  const entries = Object.entries(map)
  if (entries.length === 0) return 'GHS 0.00'
  return entries.map(([curr, amt]) => formatCurrency(amt, curr)).join(' • ')
}

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
