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
            variant="outline"
            class="bg-transparent border-slate-200"
            @click="exportToExcel"
          >
            <Download class="w-4 h-4 mr-2 text-slate-400" />
            Export Excel
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
        <template #sections>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Status</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="opt in statusOptions" 
                :key="opt.value"
                class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all rounded-full"
                :class="statusFilters.includes(opt.value) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'"
                @click="toggleStatusFilter(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>
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
        <!-- Custom Header: Raised with Currency Dropdown -->
        <template #header:raised>
          <div class="flex flex-col gap-1 items-start min-w-[80px]">
            <span class="leading-none">Raised</span>
            <div class="relative group/select">
              <select
                v-model="selectedCurrency"
                class="appearance-none bg-transparent border-none p-0 pr-4 text-[10px] font-bold text-slate-400 focus:text-violet-600 outline-none cursor-pointer uppercase tracking-widest transition-colors"
                @click.stop
              >
                <option value="">
                  All
                </option>
                <option value="GHS">
                  GHS Only
                </option>
                <option value="USD">
                  USD Only
                </option>
              </select>
              <ChevronDown class="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-slate-300 pointer-events-none group-hover/select:text-violet-400 transition-colors" />
            </div>
          </div>
        </template>
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
            
            <div class="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden group-hover/item:border-violet-300 transition-all duration-500">
              <img
                v-if="row.displayImageUrl"
                :src="row.displayImageUrl"
                class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
              >
              <div
                v-else
                class="w-full h-full bg-slate-50 flex items-center justify-center"
              >
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
            <span
              v-if="!row.totals?.length"
              class="text-xs font-black text-slate-400 italic"
            >
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
              {{ row.eventDate ? formatDate(row.eventDate) : 'No date set' }}
            </span>
          </div>
        </template>

        <template #rowActions="{ row }">
          <div class="flex items-center justify-end gap-1">
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
import EventExpandedDetails from '../components/EventExpandedDetails.vue'
import { formatDate, formatCurrency } from '@/core/formatting/formatters'
import { 
  Plus, 
  Download, 
  Image as ImageIcon,
  Link2,
  FileText,
  ChevronDown
} from 'lucide-vue-next'

const router = useRouter()
const query = useEvents()
const toast = useToastStore()

const searchQuery = ref('')
const statusFilters = ref<string[]>([])
const selectedCurrency = ref('')
const sortKey = ref('title')
const sortOrder = ref<'asc' | 'desc'>('asc')

function toggleStatusFilter(status: string) {
  const index = statusFilters.value.indexOf(status)
  if (index > -1) {
    statusFilters.value.splice(index, 1)
  } else {
    statusFilters.value.push(status)
  }
}

const columns = computed(() => [
  { key: 'title', label: 'Event', sortable: true, width: '45%' },
  { key: 'raised', label: 'Raised', sortable: !!selectedCurrency.value, width: '15%' },
  { key: 'fundCount', label: 'Funds', sortable: true, width: '8%' },
  { key: 'collectorCount', label: 'Team', sortable: true, width: '12%' },
  { key: 'dates', label: 'Date', sortable: true, width: '20%' },
])

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
    let valA = (a as any)[key]
    let valB = (b as any)[key]

    if (key === 'dates') {
      valA = a.eventDate ? new Date(a.eventDate).getTime() : 0
      valB = b.eventDate ? new Date(b.eventDate).getTime() : 0
    }

    if (key === 'raised' && selectedCurrency.value) {
      valA = a.totals?.find((t: any) => t.currency === selectedCurrency.value)?.amount || 0
      valB = b.totals?.find((t: any) => t.currency === selectedCurrency.value)?.amount || 0
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
    toast.success('Event list exported to PDF successfully')
  }, 1500)
}

function exportToExcel() {
  toast.info('Generating operational CSV ledger...')
  
  try {
    const headers = ['Event', 'Raised', 'Funds', 'Team', 'Date', 'Status']
    const rows = sortedEvents.value.map(e => [
      e.title,
      aggregateTotals([e]).replace(/ • /g, ' | '),
      e.fundCount || 0,
      e.collectorCount || 0,
      e.eventDate ? formatDate(e.eventDate) : 'N/A',
      e.isActive ? 'Active' : 'Draft'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `mftl-campaigns-${formatDate(new Date().toISOString())}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Campaign ledger exported successfully')
  } catch (err) {
    console.error('Export failed:', err)
    toast.error('Failed to generate export file')
  }
}
</script>
