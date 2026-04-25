<template>
  <div
    v-if="query.isLoading.value"
    class="py-32"
  >
    <LoadingState text="Loading event details..." />
  </div>
  <ErrorState
    v-else-if="query.isError.value"
    title="Failed to load event"
    :message="query.error.value?.message ?? 'Sync failed'"
    show-retry
    @retry="query.refetch"
  />
  <div
    v-else-if="event"
    class="space-y-10"
  >
    <DetailPageHeader
      :title="event.title"
      description="Review campaign performance, recipient funds, contributions, and public visibility."
      :back-to="{ name: 'admin-events' }"
    >
      <template #meta>
        <div class="flex items-center gap-4">
          <StatusBadge
            :status="event.status"
            :variant="event.status === 'active' ? 'success' : 'neutral'"
          />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {{ formatDate(event.eventDate) }}
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="router.push(`/admin/events/${event.id}/edit`)"
          >
            <Edit3 class="w-4 h-4 mr-2" />
            Edit
          </AppButton>
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="router.push(`/admin/events/${event.id}/recipient-funds`)"
          >
            <Target class="w-4 h-4 mr-2" />
            Manage Funds
          </AppButton>
          <AppButton
            variant="primary"
            class="!rounded-xl shadow-premium"
            @click="previewStorefront"
          >
            <ExternalLink class="w-4 h-4 mr-2" />
            Preview Storefront
          </AppButton>
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="copyPublicLink"
          >
            <Link2 class="w-4 h-4 mr-2" />
            Copy Link
          </AppButton>
        </div>
      </template>
    </DetailPageHeader>

    <!-- Status Bar / Performance Overview -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center gap-x-12 gap-y-6">
      <div class="space-y-1">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Collections</p>
        <p class="text-xl font-black text-slate-900 italic leading-none">{{ formattedTotals }}</p>
      </div>
      
      <div class="space-y-1">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient Funds</p>
        <div class="flex items-center gap-2">
          <p class="text-xl font-black text-slate-900 leading-none">{{ event.fundCount }}</p>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active targets</span>
        </div>
      </div>

      <div class="space-y-1">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Goal Progress (GHS)</p>
        <div class="flex items-center gap-3">
          <div class="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-violet-600 rounded-full" :style="{ width: `${calculateProgress(event)}%` }" />
          </div>
          <span class="text-xs font-black text-slate-900">{{ calculateProgress(event) }}%</span>
        </div>
      </div>

      <div class="ml-auto flex items-center gap-8">
        <div class="text-right space-y-1">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Collectors</p>
          <p class="text-sm font-black text-slate-900">{{ event.collectorCount }} Assigned</p>
        </div>
      </div>
    </div>

    <div class="space-y-8">
      <DetailTabs
        v-model="activeTab"
        :tabs="tabs"
      />

      <div class="min-h-[400px]">
        <!-- Overview Tab -->
        <div
          v-if="activeTab === 'overview'"
          class="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          <div class="lg:col-span-8 space-y-8">
            <AppCard class="!p-8">
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Event Description
              </h3>
              <p class="text-slate-600 leading-relaxed">
                {{ event.description || 'No description provided for this event.' }}
              </p>
            </AppCard>

            <div class="space-y-4">
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Fund Breakdown
              </h3>
              <EventRecipientFundsList :event-id="event.id" />
            </div>
          </div>

          <div class="lg:col-span-4 space-y-8">
            <DetailSummaryCard 
              title="Campaign Details"
              :items="campaignSummaryItems"
            />

            <AppCard class="!p-6 bg-violet-600 text-white shadow-premium">
              <h4 class="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">
                Next Recommended Action
              </h4>
              <p class="text-sm font-bold mb-4">
                Assign collectors to start gathering field contributions.
              </p>
              <AppButton
                variant="primary"
                size="sm"
                class="w-full !bg-white !text-violet-600 !rounded-xl"
                @click="activeTab = 'collectors'"
              >
                Assign Collectors
              </AppButton>
            </AppCard>
          </div>
        </div>

        <!-- Recipient Funds Tab -->
        <div
          v-else-if="activeTab === 'funds'"
          class="space-y-6"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Assigned Recipient Funds
            </h3>
            <AppButton
              variant="primary"
              size="sm"
              class="!rounded-xl"
              @click="router.push(`/admin/events/${event.id}/recipient-funds/new`)"
            >
              <Plus class="w-4 h-4 mr-2" />
              Add Fund
            </AppButton>
          </div>
          <EventRecipientFundsList :event-id="event.id" />
        </div>

        <!-- Activity Tab -->
        <div
          v-else-if="activeTab === 'activity'"
          class="max-w-2xl"
        >
          <AppCard class="!p-8">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
              Event Audit Log
            </h3>
            <AuditTimeline :events="auditItems" />
            
            <div class="mt-10 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <p class="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                Backend Notice
              </p>
              <p class="text-xs text-amber-600 mt-1">
                Comprehensive audit logs are currently in development. Showing initial system events.
              </p>
            </div>
          </AppCard>
        </div>

        <!-- Other tabs placeholder -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-20 text-slate-400"
        >
          <Inbox class="w-12 h-12 mb-4 opacity-20" />
          <p class="text-[10px] font-black uppercase tracking-widest">
            {{ activeTab }} content coming soon
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent } from '../composables/useEvents'
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import AuditTimeline from '@/shared/components/feedback/AuditTimeline.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import EventRecipientFundsList from '../components/EventRecipientFundsList.vue'
import { formatDate, formatCurrency } from '@/core/formatting/formatters'
import { 
  Edit3, 
  Target, 
  ExternalLink, 
  Link2,
  Plus,
  Inbox
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const formattedTotals = computed(() => {
  if (!event.value?.totals?.length) return 'GHS 0.00'
  return event.value.totals.map(t => formatCurrency(t.amount, t.currency)).join(' • ')
})

function calculateProgress(e: any) {
  if (!e?.totalTarget || !e?.totals?.length) return 0
  const ghsTotal = e.totals.find((t: any) => t.currency === 'GHS')?.amount ?? 0
  return Math.min(100, Math.round((ghsTotal / e.totalTarget) * 100))
}

const eventId = computed(() => route.params.id as string)
const query = useEvent(eventId.value)
const event = computed(() => query.data.value)

const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'funds', label: 'Recipient Funds' },
  { key: 'contributions', label: 'Contributions' },
  { key: 'collectors', label: 'Collectors' },
  { key: 'activity', label: 'Activity / Audit' },
  { key: 'settings', label: 'Settings' },
]

const campaignSummaryItems = computed(() => [
  { key: 'slug', label: 'Public Slug', value: `/give/${event.value?.slug}` },
  { key: 'currency', label: 'Currencies', value: event.value?.totals?.map(t => t.currency).join(', ') || 'GHS' },
  { key: 'date', label: 'Created At', value: formatDate(event.value?.eventDate) },
])

const auditItems = computed(() => [
  {
    id: '1',
    type: 'creation' as const,
    content: 'Event Created',
    target: event.value?.title || '',
    description: `Event initialized by system`,
    date: formatDate(event.value?.eventDate),
    datetime: event.value?.eventDate || new Date().toISOString()
  },
  {
    id: '2',
    type: 'update' as const,
    content: 'Status Updated',
    target: event.value?.status || '',
    description: `Event status moved to operational state`,
    date: 'Today',
    datetime: new Date().toISOString()
  }
])

function copyPublicLink() {
  if (!event.value) return
  const url = `${window.location.origin}/give/${event.value.slug}`
  navigator.clipboard.writeText(url)
}

function previewStorefront() {
  if (!event.value) return
  window.open(`/give/${event.value.slug}`, '_blank')
}
</script>
