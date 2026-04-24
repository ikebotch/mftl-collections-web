<template>
  <div class="space-y-10">
    <!-- Header with Action -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <PageHeader
        eyebrow="Overview"
        title="Welcome back, Isaac!"
        description="Here's what's happening with your ministry today."
      />
      <div class="flex items-center gap-3">
        <div class="hidden md:flex flex-col items-end px-4 border-r border-slate-200">
          <span class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Reporting Period</span>
          <span class="text-sm font-bold text-slate-700">Apr 17 - Apr 23, 2026</span>
        </div>
        <AppButton variant="primary">
          <span class="mr-1">+</span> New Event
        </AppButton>
      </div>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Optimizing your dashboard data..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Dashboard Offline"
      :message="query.error.value?.message ?? 'We encountered a sync issue. Please retry.'"
      show-retry
      @retry="query.refetch"
    />
    
    <template v-else>
      <!-- Stats Grid -->
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Collected"
          :value="query.data.value?.totalCollected ?? 'GBP 0.00'"
          hint="vs last 7 days"
          :trend="{ value: '0%', positive: true }"
        />
        <MetricCard
          label="Total Contributions"
          :value="query.data.value?.totalContributions ?? '0'"
          hint="vs last 7 days"
          :trend="{ value: '0%', positive: true }"
        />
        <MetricCard
          label="Active Events"
          :value="query.data.value?.totalEvents ?? '0'"
          hint="vs last 7 days"
          :trend="{ value: '0%', positive: true }"
        />
        <MetricCard
          label="Recipient Funds"
          :value="query.data.value?.activeRecipientFunds ?? '0'"
          hint="vs last 7 days"
          :trend="{ value: '0%', positive: true }"
        />
      </div>

      <div
        v-if="query.data.value?.totalEvents === '0'"
        class="mt-12"
      >
        <EmptyState
          title="No Events Found"
          description="Ready to start collecting? Create your first event to see real-time data here."
          action-label="Create First Event"
          @action="$router.push('/admin/events/new')"
        />
      </div>

      <!-- Main Visual Section -->
      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Collection Trend Chart -->
        <AppCard
          class="lg:col-span-2"
          padded
        >
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold font-display">
              Collection Trend
            </h3>
            <select class="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          
          <div class="h-64 w-full relative group">
            <!-- Simple SVG Placeholder for Chart -->
            <svg
              viewBox="0 0 800 200"
              class="w-full h-full"
            >
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style="stop-color:#8b5cf6;stop-opacity:0.2"
                  />
                  <stop
                    offset="100%"
                    style="stop-color:#8b5cf6;stop-opacity:0"
                  />
                </linearGradient>
              </defs>
              <path
                d="M0,150 Q100,100 200,120 T400,80 T600,100 T800,50 L800,200 L0,200 Z"
                fill="url(#gradient)"
              />
              <path
                d="M0,150 Q100,100 200,120 T400,80 T600,100 T800,50"
                fill="none"
                stroke="#8b5cf6"
                stroke-width="4"
                stroke-linecap="round"
              />
              <!-- Dots -->
              <circle
                cx="200"
                cy="120"
                r="6"
                fill="white"
                stroke="#8b5cf6"
                stroke-width="3"
              />
              <circle
                cx="400"
                cy="80"
                r="6"
                fill="white"
                stroke="#8b5cf6"
                stroke-width="3"
              />
              <circle
                cx="600"
                cy="100"
                r="6"
                fill="white"
                stroke="#8b5cf6"
                stroke-width="3"
              />
              <circle
                cx="800"
                cy="50"
                r="6"
                fill="white"
                stroke="#8b5cf6"
                stroke-width="3"
              />
            </svg>
            <!-- X-Axis Labels -->
            <div class="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Apr 17</span>
              <span>Apr 18</span>
              <span>Apr 19</span>
              <span>Apr 20</span>
              <span>Apr 21</span>
              <span>Apr 22</span>
              <span>Apr 23</span>
            </div>
          </div>
        </AppCard>

        <!-- Recent Activity Feed -->
        <AppCard padded>
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold font-display">
              Recent Activity
            </h3>
            <button class="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">
              View all
            </button>
          </div>
          
          <div class="space-y-8">
            <div
              v-for="i in 4"
              :key="i"
              class="flex gap-4 relative pb-8 last:pb-0"
            >
              <div
                v-if="i < 4"
                class="absolute left-5 top-10 bottom-0 w-px bg-slate-100"
              />
              <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 z-10">
                <span v-if="i === 1">💰</span>
                <span v-else-if="i === 2">👤</span>
                <span v-else-if="i === 3">📜</span>
                <span v-else>🎉</span>
              </div>
              <div class="flex-1 pt-0.5">
                <p class="text-sm font-bold text-slate-900 leading-tight">
                  {{ i === 1 ? 'Payment received for "Youth Conference"' : i === 2 ? 'New contribution recorded' : i === 3 ? 'Settlement completed' : 'New event created: "Missions Outreach"' }}
                </p>
                <p class="text-xs text-slate-400 mt-1">
                  {{ i === 1 ? '$250.00 via Paystack' : i === 2 ? '$100.00 by John Doe' : i === 3 ? '$1,250.00 to Main Account' : '2h ago' }}
                </p>
              </div>
              <span class="text-[10px] font-bold text-slate-300 uppercase tracking-tighter whitespace-nowrap pt-1">
                {{ i === 1 ? '2m ago' : i === 2 ? '15m ago' : i === 3 ? '1h ago' : '2h ago' }}
              </span>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Secondary Info Section -->
      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Top Events -->
        <AppCard
          class="lg:col-span-1"
          padded
        >
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold font-display">
              Top Events
            </h3>
            <button class="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">
              View all
            </button>
          </div>
          <div class="space-y-6">
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-center gap-4 group cursor-pointer"
            >
              <div class="text-xs font-black text-slate-300 w-4">
                {{ i }}
              </div>
              <div class="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                <div class="w-full h-full bg-slate-200 animate-pulse" />
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                  {{ i === 1 ? 'Youth Conference 2026' : i === 2 ? 'Easter Retreat' : 'Missions Outreach' }}
                </h4>
                <div class="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    class="bg-brand-500 h-full rounded-full transition-all duration-1000"
                    :style="{ width: i === 1 ? '85%' : i === 2 ? '65%' : '45%' }"
                  />
                </div>
              </div>
              <div class="text-sm font-bold text-slate-900">
                {{ i === 1 ? '$8,450.00' : i === 2 ? '$6,220.50' : '$4,310.00' }}
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Payment Methods Pie Placeholder -->
        <AppCard padded>
          <h3 class="text-lg font-bold font-display mb-8">
            Payment Methods
          </h3>
          <div class="flex flex-col items-center">
            <!-- Simple Pie Chart with SVG -->
            <svg
              viewBox="0 0 100 100"
              class="w-48 h-48 rotate-[-90deg]"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#8b5cf6"
                stroke-width="20"
                stroke-dasharray="125 251"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#10b981"
                stroke-width="20"
                stroke-dasharray="62 251"
                stroke-dashoffset="-125"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#f59e0b"
                stroke-width="20"
                stroke-dasharray="38 251"
                stroke-dashoffset="-187"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#3b82f6"
                stroke-width="20"
                stroke-dasharray="26 251"
                stroke-dashoffset="-225"
              />
            </svg>
            <div class="grid grid-cols-2 gap-4 mt-8 w-full">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-brand-500" />
                <span class="text-xs font-bold text-slate-500">Card</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-emerald-500" />
                <span class="text-xs font-bold text-slate-500">MoMo</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-amber-500" />
                <span class="text-xs font-bold text-slate-500">Bank</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-blue-500" />
                <span class="text-xs font-bold text-slate-500">Cash</span>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Upcoming Events -->
        <AppCard padded>
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold font-display">
              Upcoming Events
            </h3>
            <button class="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">
              View all
            </button>
          </div>
          <div class="space-y-6">
            <div
              v-for="i in 2"
              :key="i"
              class="flex gap-4 group"
            >
              <div class="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                <div class="w-full h-full bg-slate-200" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-slate-900 truncate">
                  {{ i === 1 ? 'Youth Conference 2026' : 'Missions Outreach' }}
                </h4>
                <div class="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>📅</span>
                  <span>{{ i === 1 ? 'May 15' : 'Jun 05' }}</span>
                </div>
                <div class="mt-2">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
                    In {{ i === 1 ? '22 days' : '43 days' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from '../composables/useDashboard'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'

const query = useDashboard()
</script>
