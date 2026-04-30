<template>
  <div class="pb-24 md:pb-8 space-y-0 md:space-y-8">
    <!-- ─── Loading / Error ─── -->
    <LoadingState v-if="query.isLoading.value" text="Loading dashboard…" />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load dashboard"
      :message="query.error.value?.message ?? 'Check your connection and try again.'"
      show-retry
      @retry="query.refetch"
    />

    <div v-else-if="query.data.value">

      <!-- ══════════════════════════════════════════════════
           PHONE HEADER  (< 768 px)
           Greeting + quick-action row, no AdminPageHeader
      ══════════════════════════════════════════════════ -->
      <section class="md:hidden bg-white border-b border-slate-100 px-4 pt-5 pb-4 space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[10px] font-black text-violet-600 uppercase tracking-widest">Collector Terminal</p>
            <h1 class="text-xl font-black text-slate-900 mt-0.5">
              Hi, {{ query.data.value.profile.name.split(' ')[0] }} 👋
            </h1>
          </div>
          <button
            class="p-2.5 border border-slate-200 rounded"
            @click="query.refetch"
          >
            <RefreshCcw class="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <!-- Phone: 2-col stat strip -->
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-slate-50 border border-slate-100 px-3 py-2.5 rounded"
          >
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
            <p class="text-base font-black text-slate-900 mt-0.5">{{ stat.value }}</p>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           TABLET / DESKTOP HEADER  (>= 768 px)
      ══════════════════════════════════════════════════ -->
      <AdminPageHeader
        class="hidden md:flex"
        title="Collector Dashboard"
        :description="`Welcome back, ${query.data.value.profile.name}`"
      >
        <template #actions>
          <AppButton variant="outline" size="sm" @click="query.refetch">
            <RefreshCcw class="w-4 h-4 mr-2" />Sync
          </AppButton>
          <AppButton variant="primary" size="sm" @click="$router.push('/collector/contributions/new')">
            <Plus class="w-4 h-4 mr-2" />New Collection
          </AppButton>
        </template>
      </AdminPageHeader>

      <!-- Tablet / Desktop: metric cards row -->
      <section class="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
      </section>

      <!-- ══════════════════════════════════════════════════
           MAIN CONTENT
           phone:   single column, full-width list
           tablet:  single column card layout
           desktop: 8 / 4 col split
      ══════════════════════════════════════════════════ -->
      <div class="xl:grid xl:grid-cols-12 xl:gap-8 xl:items-start">

        <!-- LEFT / MAIN — Assignments -->
        <div class="xl:col-span-8">

          <!-- Phone section label -->
          <div class="md:hidden flex items-center justify-between px-4 pt-5 pb-2">
            <p class="text-xs font-black text-slate-500 uppercase tracking-widest">Your Assignments</p>
            <button class="p-1" @click="showFigures = !showFigures">
              <component :is="showFigures ? Eye : EyeOff" class="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <!-- Tablet / Desktop section header -->
          <div class="hidden md:flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight">Your Assignments</h3>
              <p class="text-xs text-slate-400 font-medium mt-0.5">Active events and funds you are collecting for</p>
            </div>
            <button class="p-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors" @click="showFigures = !showFigures">
              <component :is="showFigures ? Eye : EyeOff" class="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <!-- No-assignments state -->
          <div v-if="!query.data.value.profile.hasAssignments" class="mx-4 md:mx-0">
            <EmptyState
              title="No active assignments"
              description="Contact your administrator to be assigned to an event."
              icon="calendar"
            />
          </div>

          <!-- ── Events + Fund cards ── -->
          <template v-else>
            <div
              v-for="event in query.data.value.assignments.events"
              :key="event.id"
              class="
                bg-white border-y border-slate-100
                md:border md:border-slate-200 md:shadow-sm md:mb-4
                md:rounded-none
              "
            >
              <!-- Event header -->
              <div class="
                px-4 md:px-6 py-3 md:py-4
                bg-slate-50 border-b border-slate-100
                flex items-center justify-between
              ">
                <div>
                  <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">{{ event.title }}</h3>
                  <p class="text-xs text-slate-500 mt-0.5">{{ event.dateLabel }} · {{ event.location || 'No location' }}</p>
                </div>
                <span class="text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 shrink-0">
                  {{ event.assignedFundCount }} fund{{ event.assignedFundCount !== 1 ? 's' : '' }}
                </span>
              </div>

              <!-- Fund rows -->
              <div class="divide-y divide-slate-100">
                <button
                  v-for="fund in fundsForEvent(event.id)"
                  :key="fund.id"
                  class="
                    w-full px-4 md:px-6 py-4 md:py-5
                    flex items-center justify-between
                    hover:bg-slate-50 active:bg-slate-100
                    transition-colors text-left
                    min-h-[60px] md:min-h-0
                  "
                  @click="navigateToCollect(event, fund)"
                >
                  <div class="flex items-center gap-3 md:gap-4 min-w-0">
                    <div class="w-8 h-8 md:w-9 md:h-9 bg-violet-600 flex items-center justify-center text-white shrink-0">
                      <Wallet class="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-black text-slate-900 truncate">{{ fund.name }}</p>
                      <p class="text-xs text-slate-500 truncate hidden sm:block">{{ fund.description || 'General collection fund' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <div class="text-right">
                      <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Collected</p>
                      <p class="text-sm font-black text-slate-900">
                        {{ showFigures ? formatCurrency(fund.collectedAmount, fund.currency) : '***' }}
                      </p>
                    </div>
                    <ArrowRight class="w-4 h-4 text-slate-300 hidden md:block" />
                  </div>
                </button>

                <div
                  v-if="fundsForEvent(event.id).length === 0"
                  class="px-4 md:px-6 py-4 text-sm text-slate-400"
                >
                  No funds assigned to this event yet.
                </div>
              </div>

              <!-- Currency breakdown (collapsible) -->
              <div v-if="eventCurrencyTotals(event.id).length > 0" class="border-t border-slate-100">
                <button
                  class="w-full px-4 md:px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  @click="toggleEventExpand(event.id)"
                >
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Currency breakdown</span>
                  <ChevronDown
                    class="w-4 h-4 text-slate-400 transition-transform duration-300"
                    :class="{ 'rotate-180': expandedEvents.has(event.id) }"
                  />
                </button>
                <div v-if="expandedEvents.has(event.id)" class="bg-slate-50 divide-y divide-slate-100">
                  <div
                    v-for="total in eventCurrencyTotals(event.id)"
                    :key="total.currency"
                    class="px-6 md:px-8 py-3 md:py-4 flex items-center justify-between"
                  >
                    <span class="text-xs font-black text-slate-700">{{ total.label || total.currency }}</span>
                    <span class="text-sm font-black text-slate-900">
                      {{ showFigures ? formatCurrency(total.total, total.currency) : '***' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- RIGHT — Recent Activity (desktop sidebar, phone bottom section) -->
        <div class="xl:col-span-4 mt-0 xl:mt-0">
          <div class="
            md:hidden
            flex items-center justify-between px-4 pt-6 pb-2
          ">
            <p class="text-xs font-black text-slate-500 uppercase tracking-widest">Recent Activity</p>
            <router-link to="/collector/history" class="text-xs font-bold text-violet-600">View all</router-link>
          </div>
          <div class="hidden md:flex items-center justify-between mb-4">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight">Recent Activity</h3>
            <router-link to="/collector/history" class="text-xs font-bold text-violet-600 hover:underline">View all</router-link>
          </div>

          <div class="bg-white border-y border-slate-100 md:border md:border-slate-200 md:shadow-sm divide-y divide-slate-100">
            <div
              v-for="receipt in query.data.value.recentReceipts"
              :key="receipt.id"
              class="px-4 md:px-5 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer min-h-[60px]"
              @click="openReceipt(receipt)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <Receipt class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-black text-slate-900 uppercase truncate">{{ receipt.contributorName || 'Anonymous' }}</p>
                  <p class="text-xs text-slate-400 font-bold truncate">{{ receipt.eventTitle }}</p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-black text-slate-900">{{ receipt.amount }}</p>
                <ReceiptStatusBadge :status="receipt.status" class="scale-75 origin-right" />
              </div>
            </div>
            <div v-if="!query.data.value.recentReceipts.length" class="px-5 py-8 text-center text-sm text-slate-400 font-medium">
              No recent collections.
            </div>
          </div>
        </div>
      </div>


      <!-- Detail drawer (all breakpoints) -->
      <DetailDrawer
        :is-open="isDrawerOpen"
        title="Contribution Details"
        :subtitle="selectedReceipt?.receiptNumber"
        @close="isDrawerOpen = false"
      >
        <ContributionDetailView v-if="selectedReceipt" :contribution="selectedReceipt" />
      </DetailDrawer>

      <!-- ══════════════════════════════════════════════════
           PHONE: Sticky bottom CTA
      ══════════════════════════════════════════════════ -->
      <div
        class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 px-4 py-3 safe-area-bottom z-30"
      >
        <button
          class="w-full bg-violet-600 text-white py-4 text-sm font-black uppercase tracking-widest active:opacity-90 transition-opacity flex items-center justify-center gap-2"
          @click="$router.push('/collector/contributions/new')"
        >
          <Plus class="w-4 h-4" />
          Record New Collection
        </button>
      </div>
    </div>
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
import { Plus, RefreshCcw, Eye, EyeOff, Wallet, ChevronDown, ArrowRight, Receipt } from 'lucide-vue-next'

const router = useRouter()
const query = useCollectorDashboard()

const isDrawerOpen = ref(false)
const selectedReceipt = ref<any>(null)
const showFigures = ref(true)
const expandedEvents = ref(new Set<string>())

function toggleEventExpand(eventId: string) {
  expandedEvents.value.has(eventId) ? expandedEvents.value.delete(eventId) : expandedEvents.value.add(eventId)
  expandedEvents.value = new Set(expandedEvents.value)
}

function fundsForEvent(eventId: string): CollectorAssignedFund[] {
  return (query.data.value?.assignments.funds ?? []).filter(f => f.eventId === eventId)
}

function eventCurrencyTotals(eventId: string) {
  const byCode: Record<string, { currency: string; total: number; label: string }> = {}
  for (const fund of fundsForEvent(eventId)) {
    if (!byCode[fund.currency]) byCode[fund.currency] = { currency: fund.currency, total: 0, label: fund.currency }
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
    { label: 'Today Total', value: showFigures.value ? query.data.value.todayTotal : '***', icon: 'TrendingUp', color: 'green' as const },
    { label: 'Receipts', value: String(profile.receiptsIssuedToday), icon: 'FileText', color: 'purple' as const },
    { label: 'Events', value: String(profile.assignedEventCount), icon: 'Calendar', color: 'amber' as const },
    { label: 'Funds', value: String(profile.assignedFundCount), icon: 'Wallet', color: 'blue' as const },
  ]
})

onMounted(() => {
  const first = query.data.value?.assignments.events[0]
  if (first) expandedEvents.value.add(first.id)
})
</script>
