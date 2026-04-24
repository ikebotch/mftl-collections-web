<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-display tracking-tight text-slate-900">
          Events
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          Manage your fundraising events and their collection status.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <AppButton
          variant="outline"
          class="hidden sm:flex"
        >
          <Download class="w-4 h-4 mr-2" />
          Export
        </AppButton>
        <AppButton
          variant="primary"
          @click="router.push('/admin/events/new')"
        >
          <Plus class="w-4 h-4 mr-2" />
          Create Event
        </AppButton>
      </div>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading events dashboard..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load events"
      :message="query.error.value?.message ?? 'Please retry.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    
    <template v-else-if="query.data.value">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Events"
          :value="query.data.value.length.toString()"
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
          label="Active Collectors"
          value="--"
          icon="Users"
          color="blue"
        />
        <MetricCard
          label="Monthly Revenue"
          value="--"
          icon="BarChart3"
          color="amber"
        />
      </div>

      <AppCard class="overflow-hidden">
        <AppTable
          :columns="columns"
          :rows="query.data.value"
          row-key="id"
          empty-message="No events created yet."
        >
          <template #expansion="{ row }">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div 
                v-for="fund in row.recipientFunds" 
                :key="fund.id"
                class="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Recipient Fund</p>
                  <p class="text-sm font-bold text-slate-900">{{ fund.name }}</p>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <div class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {{ formatCurrency(fund.collectedAmount, fund.currency) }} Raised
                  </div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Target: {{ formatCurrency(fund.targetAmount, fund.currency) }}
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #cell:title="{ value, row }">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                <Calendar class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-bold text-slate-900 truncate">
                  {{ value }}
                </p>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  /{{ row.slug }}
                </p>
              </div>
            </div>
          </template>

          <template #cell:eventDate="{ value }">
            <div class="flex items-center gap-2 text-slate-600 font-medium text-sm">
              {{ formatDate(value) }}
            </div>
          </template>

          <template #cell:progress="{ row }">
            <div class="space-y-2 min-w-[140px]">
              <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em]">
                <span class="text-slate-500">{{ formatCurrency(row.totalRaised, 'GHS') }}</span>
                <span class="text-slate-900">{{ row.progress }}%</span>
              </div>
              <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  :style="{ width: `${row.progress}%` }"
                />
              </div>
            </div>
          </template>

          <template #cell:status="{ value }">
            <EventStatusBadge :status="value" />
          </template>

          <template #cell:actions="{ row }">
            <div class="flex items-center gap-2">
              <AppButton 
                variant="ghost" 
                size="sm"
                @click="router.push(`/admin/events/${row.id}`)"
              >
                <Eye class="w-4 h-4" />
              </AppButton>
              <CopyLinkButton :link="`https://mftl-collections.com/events/${row.slug}`" />
            </div>
          </template>
        </AppTable>
      </AppCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '../composables/useEvents'
import EventStatusBadge from '../components/EventStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import CopyLinkButton from '@/shared/components/buttons/CopyLinkButton.vue'
import { formatDate, formatCurrency } from '@/shared/utils/formatters'
import { 
  Plus, 
  Download, 
  Calendar, 
  Eye, 
  Users,
  BarChart3,
  Wallet
} from 'lucide-vue-next'

const router = useRouter()
const query = useEvents()

const columns = [
  { key: 'title', label: 'Event Name' },
  { key: 'eventDate', label: 'Schedule' },
  { key: 'progress', label: 'Progress' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

const totalRaised = computed(() => {
  return (query.data.value ?? []).reduce((acc, event) => acc + (event.totalRaised || 0), 0)
})
</script>
