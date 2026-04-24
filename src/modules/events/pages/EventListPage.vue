<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900">
          Events Command
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          Orchestrate and monitor all fundraising activities.
        </p>
      </div>
      
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
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Syncing event data..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Sync failed"
      :message="query.error.value?.message ?? 'Please check your connection.'"
      show-retry
      @retry="query.refetch"
    />
    
    <template v-else-if="query.data.value">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Operational Events"
          :value="query.data.value.length.toString()"
          icon="Calendar"
          color="purple"
          description="Active & Draft events"
        />
        <MetricCard
          label="Total Raised"
          :value="formatCurrency(totalRaised, 'GHS')"
          icon="Wallet"
          color="green"
          description="Aggregated from all funds"
        />
        <MetricCard
          label="Average Progress"
          :value="avgProgress + '%'"
          icon="TrendingUp"
          color="blue"
          description="Overall completion rate"
        />
        <MetricCard
          label="Total Collectors"
          :value="totalCollectors.toString()"
          icon="Users"
          color="amber"
          description="Assigned personnel"
        />
      </div>

      <!-- Main Activity Table -->
      <AppCard class="!p-0 border-none shadow-premium overflow-hidden">
        <div class="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Activity Feed
          </h3>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Status</span>
          </div>
        </div>
        <AppTable
          :columns="columns"
          :rows="query.data.value"
          row-key="id"
          empty-message="No operational events found."
        >
          <template #expansion="{ row }">
            <div class="p-8 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <!-- Recipient Funds -->
              <div class="lg:col-span-5 space-y-6">
                <div class="flex items-center justify-between">
                  <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Recipient Funds
                  </h4>
                  <span class="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{{ row.fundCount }} Funds</span>
                </div>
                <EventRecipientFundsList :event-id="row.id" />
              </div>

              <!-- Summary Stats -->
              <div class="lg:col-span-3 space-y-6 border-l border-slate-100 pl-8">
                <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Performance Summary
                </h4>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <span class="text-xs font-bold text-slate-500">Total Raised</span>
                    <span class="text-sm font-black text-slate-900">{{ formatCurrency(row.totalRaised, 'GHS') }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <span class="text-xs font-bold text-slate-500">Goal Target</span>
                    <span class="text-sm font-black text-slate-900">{{ formatCurrency(row.totalTarget, 'GHS') }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <span class="text-xs font-bold text-slate-500">Active Collectors</span>
                    <span class="text-sm font-black text-slate-900">{{ row.collectorCount }}</span>
                  </div>
                </div>
                <div class="pt-4">
                  <div class="p-4 rounded-2xl bg-violet-600 text-white shadow-premium">
                    <p class="text-[9px] font-black uppercase tracking-widest opacity-70">
                      Average Progress
                    </p>
                    <p class="text-2xl font-black mt-1">
                      {{ row.progress }}%
                    </p>
                  </div>
                </div>
              </div>

              <!-- Recent Activity Placeholder -->
              <div class="lg:col-span-4 space-y-6 border-l border-slate-100 pl-8">
                <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Recent Activity
                </h4>
                <div class="space-y-4">
                  <div
                    v-if="row.totalRaised === 0"
                    class="text-center py-10"
                  >
                    <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <Inbox class="w-6 h-6" />
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      No recent activity
                    </p>
                  </div>
                  <div
                    v-else
                    class="space-y-3"
                  >
                    <!-- Placeholder activities -->
                    <div
                      v-for="i in 3"
                      :key="i"
                      class="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-50 shadow-sm opacity-60"
                    >
                      <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {{ String.fromCharCode(64 + i) }}
                      </div>
                      <div class="flex-1">
                        <p class="text-[10px] font-black text-slate-900 uppercase">
                          Anonymous Gift
                        </p>
                        <p class="text-[9px] font-bold text-slate-400">
                          2h ago · Cash
                        </p>
                      </div>
                      <span class="text-[10px] font-black text-emerald-600">GHS 50</span>
                    </div>
                  </div>
                </div>
                <AppButton
                  variant="ghost"
                  size="sm"
                  class="w-full !rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white border border-transparent hover:border-slate-100 shadow-none"
                >
                  View Activity Feed
                </AppButton>
              </div>
            </div>
          </template>

          <template #cell:title="{ value, row }">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-white group-hover:border-violet-100 transition-all">
                <Calendar class="w-6 h-6" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-black text-slate-900 truncate tracking-tight">
                  {{ value }}
                </p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {{ formatDate(row.eventDate) }} · /give/{{ row.slug }}
                </p>
              </div>
            </div>
          </template>

          <template #cell:totalRaised="{ value }">
            <div class="text-sm font-black text-slate-900 tracking-tight">
              {{ formatCurrency(value, 'GHS') }}
            </div>
          </template>

          <template #cell:totalTarget="{ value }">
            <div class="text-sm font-bold text-slate-400 tracking-tight">
              {{ value > 0 ? formatCurrency(value, 'GHS') : 'No Target' }}
            </div>
          </template>

          <template #cell:fundCount="{ value }">
            <div class="text-sm font-black text-slate-900 text-center w-8">
              {{ value }}
            </div>
          </template>

          <template #cell:collectorCount="{ value }">
            <div class="text-sm font-black text-slate-900 text-center w-8">
              {{ value }}
            </div>
          </template>

          <template #cell:progress="{ row }">
            <div class="flex items-center gap-3 min-w-[140px]">
              <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                <div 
                  class="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  :style="{ width: `${row.progress}%` }"
                />
              </div>
              <span class="text-[10px] font-black text-slate-900 min-w-[2.5rem]">{{ row.progress }}%</span>
            </div>
          </template>

          <template #cell:status="{ value }">
            <EventStatusBadge
              :status="value"
              class="scale-90"
            />
          </template>

          <template #cell:actions="{ row }">
            <div class="flex items-center gap-1">
              <AppButton 
                variant="ghost" 
                size="sm"
                class="!rounded-xl hover:bg-violet-50 hover:text-violet-600 transition-colors"
                @click="router.push(`/admin/events/${row.id}`)"
              >
                <Eye class="w-4 h-4" />
              </AppButton>
              <CopyLinkButton 
                :link="`https://mftl-collections.com/events/${row.slug}`" 
                class="!rounded-xl hover:bg-violet-50 hover:text-violet-600 transition-colors"
              />
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
import EventRecipientFundsList from '../components/EventRecipientFundsList.vue'
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
  Inbox
} from 'lucide-vue-next'

const router = useRouter()
const query = useEvents()

const columns = [
  { key: 'title', label: 'Event' },
  { key: 'totalRaised', label: 'Raised' },
  { key: 'totalTarget', label: 'Goal' },
  { key: 'progress', label: 'Progress' },
  { key: 'fundCount', label: 'Funds' },
  { key: 'collectorCount', label: 'Collectors' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

const totalRaised = computed(() => {
  return (query.data.value ?? []).reduce((acc, e) => acc + e.totalRaised, 0)
})

const avgProgress = computed(() => {
  const events = query.data.value ?? []
  if (events.length === 0) return 0
  return Math.round(events.reduce((acc, e) => acc + e.progress, 0) / events.length)
})

const totalCollectors = computed(() => {
  return (query.data.value ?? []).reduce((acc, e) => acc + (e.collectorCount || 0), 0)
})
</script>
