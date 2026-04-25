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
            class="bg-transparent border-slate-200"
            @click="exportToPdf"
          >
            <FileText class="w-4 h-4 mr-2 text-slate-400" />
            Export PDF
          </AppButton>
          <AppButton
            variant="primary"
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
        placeholder="Search events by title..."
      >
        <template #extra>
          <div class="flex items-center gap-4">
            <MultiSelectFilter
              v-model="statusFilters"
              label="Status"
              :options="statusOptions"
            />
          </div>
        </template>
      </AdminFilterBar>

      <DataTable
        :columns="columns"
        :rows="sortedEvents"
        :loading="query.isLoading.value"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        expandable
        exportable
        @sort="handleSort"
        @retry="query.refetch"
      >
        <!-- Custom Cell: Title (with Status Indicator) -->
        <template #cell:title="{ row }">
          <div 
            class="flex items-center gap-4 group/item py-1 cursor-pointer"
            @click="router.push(`/admin/events/${row.id}`)"
          >
            <!-- Status Circle -->
            <div 
              class="w-2.5 h-2.5 shrink-0 rounded-full transition-all duration-500"
              :class="[
                row.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300',
                'border border-white ring-1 ring-slate-100'
              ]"
              :title="row.isActive ? 'Active' : 'Draft'"
            />
            
            <div class="w-10 h-10 rounded-none bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden group-hover/item:border-violet-300 transition-all duration-500">
              <img
                v-if="row.displayImageUrl"
                :src="row.displayImageUrl"
                class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
              >
              <div v-else class="w-full h-full bg-slate-50 flex items-center justify-center">
                <ImageIcon class="w-4 h-4 text-slate-300" />
              </div>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-black text-slate-900 truncate tracking-tight leading-none group-hover/item:text-violet-600 transition-colors">
                {{ row.title }}
              </p>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">
                {{ row.isActive ? 'Live Campaign' : 'Administrative Draft' }}
              </p>
            </div>
          </div>
        </template>

        <!-- Custom Cell: Raised (Combined) -->
        <template #cell:raised="{ row }">
          <div class="flex flex-col gap-1 py-1">
            <span 
              v-for="total in row.totals" 
              :key="total.currency"
              class="text-xs font-black italic tracking-tight leading-none"
              :class="total.currency === 'USD' ? 'text-violet-600' : 'text-slate-900'"
            >
              {{ formatCurrency(total.amount, total.currency) }}
            </span>
            <span v-if="!row.totals?.length" class="text-xs font-black text-slate-400 italic">
              GHS 0.00
            </span>
          </div>
        </template>

        <template #cell:fundCount="{ value }">
          <div class="py-1">
            <span class="text-xs font-black text-slate-900 leading-none">{{ value || 0 }}</span>
          </div>
        </template>

        <template #cell:collectorCount="{ value }">
          <div class="py-1">
            <span class="text-xs font-black text-slate-900 leading-none">{{ value || 0 }}</span>
          </div>
        </template>

        <template #cell:dates="{ row }">
          <div class="flex flex-col gap-1 py-1">
            <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
              {{ row.eventDate ? formatDate(row.eventDate, 'MMM d, yyyy') : 'No date set' }}
            </span>
          </div>
        </template>

        <template #rowActions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <AppButton
              variant="ghost"
              size="xs"
              class="hover:bg-violet-50 hover:text-violet-600 border border-transparent hover:border-violet-100"
              @click="router.push(`/admin/events/${row.id}`)"
            >
              <Eye class="w-3.5 h-3.5" />
            </AppButton>
            <AppButton
              variant="ghost"
              size="xs"
              class="hover:bg-slate-100 border border-transparent hover:border-slate-200"
              @click="copyPublicLink(row.slug)"
            >
              <Link2 class="w-3.5 h-3.5" />
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
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import EventExpandedDetails from '../components/EventExpandedDetails.vue'
import MultiSelectFilter from '@/shared/components/filters/MultiSelectFilter.vue'
import { formatDate, formatCurrency } from '@/core/formatting/formatters'
import { 
  Plus, 
  Download, 
  Calendar,
  Image as ImageIcon,
  Eye,
  Link2,
  BarChart2,
  Wallet,
  Target,
  Users,
  FileText
} from 'lucide-vue-next'

const router = useRouter()
const query = useEvents()
const toast = useToastStore()

const searchQuery = ref('')
const statusFilters = ref<string[]>([])
const sortKey = ref('title')
const sortOrder = ref<'asc' | 'desc'>('asc')

const columns = [
  { key: 'title', label: 'Event', sortable: true, width: '40%' },
  { key: 'raised', label: 'Raised', sortable: false, width: '20%' },
  { key: 'fundCount', label: 'Funds', sortable: true, width: '10%' },
  { key: 'collectorCount', label: 'Team', sortable: true, width: '10%' },
  { key: 'dates', label: 'Date', sortable: true, width: '15%' },
]

const events = computed(() => query.data.value ?? [])

const filteredEvents = computed(() => {
  let list = [...events.value]
  
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(e => 
      e.title.toLowerCase().includes(s)
    )
  }
  
  if (statusFilters.value.length > 0) {
    list = list.filter(e => {
      const status = e.isActive ? 'active' : 'draft'
      return statusFilters.value.includes(status)
    })
  }
  
  return list
})

const sortedEvents = computed(() => {
  const list = [...filteredEvents.value]
  const key = sortKey.value
  const order = sortOrder.value

  list.sort((a, b) => {
    let valA = a[key]
    let valB = b[key]

    if (key === 'dates') {
      valA = a.eventDate ? new Date(a.eventDate).getTime() : 0
      valB = b.eventDate ? new Date(b.eventDate).getTime() : 0
    }

    if (valA < valB) return order === 'asc' ? -1 : 1
    if (valA > valB) return order === 'asc' ? 1 : -1
    return 0
  })

  return list
})

function handleSort(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

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
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
]

function copyPublicLink(slug: string) {
  const url = `${window.location.origin}/give/${slug}`
  navigator.clipboard.writeText(url)
  toast.success('Public link copied to clipboard')
}

function exportToPdf() {
  toast.info('Generating operational PDF report...')
  // Mock PDF export logic
  setTimeout(() => {
    toast.success('Event list exported successfully')
  }, 1500)
}
</script>
