<template>
  <div class="space-y-8 pb-20">
    <LoadingState
      v-if="query.isLoading.value"
      text="Loading your dashboard…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load dashboard"
      :message="query.error.value?.message ?? 'Check your connection and try again.'"
      show-retry
      @retry="query.refetch"
    />
    <template v-else-if="query.data.value">
      <!-- Page Header -->
      <AdminPageHeader
        title="Collector Dashboard"
        :description="`Welcome back, ${query.data.value.profile.name}`"
      >
        <template #actions>
          <AppButton variant="outline" size="sm" @click="query.refetch">
            <RefreshCcw class="w-4 h-4 mr-2" />
            Sync
          </AppButton>
          <AppButton variant="primary" size="sm" @click="$router.push('/collector/contributions/new')">
            <Plus class="w-4 h-4 mr-2" />
            New Collection
          </AppButton>
        </template>
      </AdminPageHeader>

      <!-- Metric Cards -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          v-for="stat in stats"
          :key="stat.label"
          v-bind="stat"
        />
      </section>

      <div class="grid lg:grid-cols-12 gap-8 items-start">
        <!-- Assigned Fund Cards -->
        <div class="lg:col-span-8 space-y-6">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight">Your Assignments</h3>
              <p class="text-xs text-slate-400 font-medium mt-0.5">Active events and funds you are collecting for</p>
            </div>
          </div>

          <!-- No Assignments State -->
          <EmptyState
            v-if="!query.data.value.profile.hasAssignments"
            title="No active assignments"
            description="Contact your administrator to be assigned to an event."
            icon="calendar"
          />

          <!-- Fund Cards -->
          <template v-else>
            <div
              v-for="event in query.data.value.assignments.events"
              :key="event.id"
              class="bg-white border border-slate-200 shadow-sm"
            >
              <!-- Event Header -->
              <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight">{{ event.title }}</h3>
                  <p class="text-xs text-slate-500 mt-0.5">{{ event.dateLabel }} · {{ event.location || 'No location' }}</p>
                </div>
                <span class="text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1">
                  {{ event.assignedFundCount }} Fund{{ event.assignedFundCount !== 1 ? 's' : '' }}
                </span>
              </div>

              <!-- Fund rows within event -->
              <div class="divide-y divide-slate-100">
                <div
                  v-for="fund in fundsForEvent(event.id)"
                  :key="fund.id"
                  class="px-6 py-5 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-pointer"
                  @click="navigateToCollect(event, fund)"
                >
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="w-9 h-9 bg-violet-600 flex items-center justify-center text-white shrink-0">
                      <Wallet class="w-4 h-4" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-black text-slate-900 truncate">{{ fund.name }}</p>
                      <p class="text-xs text-slate-500 truncate">{{ fund.description || 'General collection fund' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-6 shrink-0">
                    <div class="text-right hidden sm:block">
                      <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Collected</p>
                      <p class="text-base font-black text-slate-900">
                        {{ showFigures ? formatCurrency(fund.collectedAmount, fund.currency) : '***' }}
                      </p>
                    </div>
                    <ArrowRight class="w-4 h-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                <!-- No funds for event -->
                <div
                  v-if="fundsForEvent(event.id).length === 0"
                  class="px-6 py-5 text-sm text-slate-400 font-medium"
                >
                  No funds assigned to this event yet.
                </div>
              </div>

              <!-- Currency totals expandable footer -->
              <div
                v-if="eventCurrencyTotals(event.id).length > 0"
                class="border-t border-slate-100"
              >
                <button
                  class="w-full px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  @click="toggleEventExpand(event.id)"
                >
                  <div class="flex items-center gap-2">
                    <button
                      class="p-1.5 rounded hover:bg-slate-100 transition-colors"
                      @click.stop="showFigures = !showFigures"
                    >
                      <component :is="showFigures ? Eye : EyeOff" class="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Currency breakdown</span>
                  </div>
                  <ChevronDown
                    class="w-4 h-4 text-slate-400 transition-transform duration-300"
                    :class="{ 'rotate-180': expandedEvents.has(event.id) }"
                  />
                </button>
                <div v-if="expandedEvents.has(event.id)" class="bg-slate-50 divide-y divide-slate-100">
                  <div
                    v-for="total in eventCurrencyTotals(event.id)"
                    :key="total.currency"
                    class="px-8 py-4 flex items-center justify-between"
                  >
                    <div>
                      <span class="text-xs font-black text-slate-700">{{ total.label || total.currency }}</span>
                      <span class="text-xs text-slate-400 ml-2 font-bold">{{ total.currency }}</span>
                    </div>
                    <span class="text-sm font-black text-slate-900">
                      {{ showFigures ? formatCurrency(total.total, total.currency) : '***' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Recent Activity Sidebar -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight">Recent Activity</h3>
            <router-link to="/collector/history" class="text-xs font-bold text-violet-600 hover:underline">
              View all
            </router-link>
          </div>

          <div class="bg-white border border-slate-200 shadow-sm divide-y divide-slate-100">
            <div
              v-for="receipt in query.data.value.recentReceipts"
              :key="receipt.id"
              class="px-5 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
              @click="openReceipt(receipt)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <Receipt class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-black text-slate-900 uppercase truncate">
                    {{ receipt.contributorName || 'Anonymous' }}
                  </p>
                  <p class="text-xs text-slate-400 font-bold truncate">
                    {{ receipt.eventTitle }}
                  </p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-black text-slate-900">{{ receipt.amount }}</p>
                <ReceiptStatusBadge :status="receipt.status" class="scale-75 origin-right" />
              </div>
            </div>
            <div
              v-if="!query.data.value.recentReceipts.length"
              class="px-5 py-8 text-center text-sm text-slate-400 font-medium"
            >
              No recent collections.
            </div>
          </div>
        </div>
      </div>
    </template>

    <DetailDrawer
      :is-open="isDrawerOpen"
      title="Contribution Details"
      :subtitle="selectedReceipt?.receiptNumber"
      @close="isDrawerOpen = false"
    >
      <ContributionDetailView
        v-if="selectedReceipt"
        :contribution="selectedReceipt"
      />
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectorDashboard } from '../composables/useCollector'
import { formatCurrency } from '@/core/formatting/formatters'
import type { CollectorAssignedEvent, CollectorAssignedFund } from '../types/collector'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import ContributionDetailView from '@/modules/contributions/components/ContributionDetailView.vue'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import {
  Plus,
  RefreshCcw,
  Eye,
  EyeOff,
  Wallet,
  ChevronDown,
  ArrowRight,
  Receipt,
} from 'lucide-vue-next'

const router = useRouter()
const query = useCollectorDashboard()

const isDrawerOpen = ref(false)
const selectedReceipt = ref<any>(null)
const showFigures = ref(true)
const expandedEvents = ref(new Set<string>())

function toggleEventExpand(eventId: string) {
  if (expandedEvents.value.has(eventId)) {
    expandedEvents.value.delete(eventId)
  } else {
    expandedEvents.value.add(eventId)
  }
  expandedEvents.value = new Set(expandedEvents.value) // trigger reactivity
}

function fundsForEvent(eventId: string): CollectorAssignedFund[] {
  return (query.data.value?.assignments.funds ?? []).filter(f => f.eventId === eventId)
}

function eventCurrencyTotals(eventId: string) {
  const funds = fundsForEvent(eventId)
  const byCode: Record<string, { currency: string; total: number; label: string }> = {}
  for (const fund of funds) {
    if (!byCode[fund.currency]) {
      byCode[fund.currency] = { currency: fund.currency, total: 0, label: fund.currency }
    }
    byCode[fund.currency].total += fund.collectedAmount
  }
  return Object.values(byCode)
}

function navigateToCollect(event: CollectorAssignedEvent, fund: CollectorAssignedFund) {
  router.push(`/collector/contributions/new?eventId=${event.id}&fundId=${fund.id}`)
}

function openReceipt(receipt: any) {
  selectedReceipt.value = receipt
  isDrawerOpen.value = true
}

const stats = computed(() => {
  if (!query.data.value) return []
  const { profile } = query.data.value
  return [
    {
      label: 'Today Total',
      value: showFigures.value ? query.data.value.todayTotal : '***',
      icon: 'TrendingUp',
      color: 'green' as const,
    },
    {
      label: 'Receipts Issued',
      value: String(profile.receiptsIssuedToday),
      icon: 'FileText',
      color: 'purple' as const,
    },
    {
      label: 'Active Events',
      value: String(profile.assignedEventCount),
      icon: 'Calendar',
      color: 'amber' as const,
    },
    {
      label: 'Assigned Funds',
      value: String(profile.assignedFundCount),
      icon: 'Wallet',
      color: 'blue' as const,
    },
  ]
})

onMounted(() => {
  // Expand first event by default for better UX
  const firstEvent = query.data.value?.assignments.events[0]
  if (firstEvent) {
    expandedEvents.value.add(firstEvent.id)
  }
})
</script>
