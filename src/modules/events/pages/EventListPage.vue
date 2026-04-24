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
      text="Loading events data..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load events"
      :message="query.error.value?.message ?? 'Please retry.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <EmptyState
      v-else-if="!query.data.value?.length"
      title="No events yet"
      description="Create your first event to open the public contribution flow."
      action-label="Create event"
      @action="router.push('/admin/events/new')"
    />
    
    <AppCard
      v-else
      class="overflow-hidden"
    >
      <AppTable
        :columns="columns"
        :rows="query.data.value"
        row-key="id"
      >
        <template #cell:title="{ value, row }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
              <img
                v-if="row.image"
                :src="row.image"
                class="w-full h-full object-cover"
              >
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-slate-500"
              >
                <Calendar class="w-5 h-5" />
              </div>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold text-slate-900 truncate group-hover:text-violet-600 transition-colors">
                {{ value }}
              </p>
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                {{ row.eventType }}
              </p>
            </div>
          </div>
        </template>

        <template #cell:eventDate="{ value }">
          <div class="flex items-center gap-2 text-slate-600 font-medium">
            <Calendar class="w-4 h-4 text-slate-500" />
            <span>{{ formatEventDate(value) }}</span>
          </div>
        </template>

        <template #cell:status="{ value }">
          <div 
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
            :class="value === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-600 border border-slate-200'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="value === 'active' ? 'bg-emerald-500' : 'bg-slate-400'"
            />
            {{ value }}
          </div>
        </template>

        <template #cell:actions="{ row }">
          <div class="flex items-center gap-2">
            <button 
              class="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-violet-600 transition-all"
              title="View Details"
              @click="router.push(`/admin/events/${getRowValue(row, 'id')}`)"
            >
              <Eye class="w-4 h-4" />
            </button>
            <button 
              class="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-violet-600 transition-all"
              title="Manage Funds"
              @click="router.push(`/admin/events/${getRowValue(row, 'id')}/recipient-funds`)"
            >
              <Building class="w-4 h-4" />
            </button>
            <button class="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-all">
              <MoreHorizontal class="w-4 h-4" />
            </button>
          </div>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useEvents } from '../composables/useEvents'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatDate } from '@/shared/utils/formatters'
import { 
  Plus, 
  Download, 
  Calendar, 
  Eye, 
  Building, 
  MoreHorizontal 
} from 'lucide-vue-next'

const router = useRouter()
const query = useEvents()

const columns = [
  { key: 'title', label: 'Event Name' },
  { key: 'eventDate', label: 'Schedule' },
  { key: 'status', label: 'Status' },
  { key: 'currency', label: 'Currency' },
  { key: 'actions', label: '' },
]

function getRowValue(row: unknown, key: string): string {
  if (row && typeof row === 'object') {
    return String((row as Record<string, unknown>)[key] ?? '')
  }
  return ''
}

function formatEventDate(value: unknown): string {
  return formatDate(typeof value === 'string' ? value : null)
}
</script>
