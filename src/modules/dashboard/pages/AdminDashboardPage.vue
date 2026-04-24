<template>
  <div class="space-y-10">
    <!-- Header with Action -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-display tracking-tight text-slate-900">
          Overview
        </h1>
        <p class="text-slate-600 mt-2 font-medium">
          Welcome back, Isaac! Here's what's happening with your ministry.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Date Picker Placeholder -->
        <div class="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-soft cursor-pointer hover:border-violet-300 transition-all group">
          <Calendar class="w-4 h-4 text-slate-600 group-hover:text-violet-500" />
          <span class="text-sm font-bold text-slate-700">Apr 17 - Apr 23, 2026</span>
          <ChevronDown class="w-4 h-4 text-slate-600" />
        </div>

        <div class="flex items-center shadow-soft rounded-xl overflow-hidden">
          <AppButton
            variant="primary"
            class="rounded-none rounded-l-xl px-5 py-2.5"
          >
            <Plus class="w-4 h-4 mr-2" />
            New Event
          </AppButton>
          <div class="w-px h-10 bg-violet-600" />
          <button class="bg-violet-600 hover:bg-violet-700 text-white p-2.5 transition-colors">
            <ChevronDown class="w-4 h-4" />
          </button>
        </div>
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
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          label="Total Collected"
          :value="query.data.value?.totalCollected ?? '$24,582.50'"
          icon="Wallet"
          color="purple"
          trend="+12.5%"
          trend-positive
        />
        <MetricCard
          label="Total Contributions"
          :value="query.data.value?.totalContributions ?? '152'"
          icon="Heart"
          color="green"
          trend="+18.7%"
          trend-positive
        />
        <MetricCard
          label="Active Events"
          :value="query.data.value?.totalEvents ?? '7'"
          icon="Calendar"
          color="amber"
          trend="+7.1%"
          trend-positive
        />
        <MetricCard
          label="Recipient Funds"
          :value="query.data.value?.activeRecipientFunds ?? '9'"
          icon="Building"
          color="blue"
          trend="+12.5%"
          trend-positive
        />
        <MetricCard
          label="Self Donations"
          value="$1,245.00"
          icon="Heart"
          color="red"
          trend="+15.3%"
          trend-positive
        />
        <MetricCard
          label="Active Collectors"
          value="23"
          icon="UserCheck"
          color="purple"
          trend="+9.2%"
          trend-positive
        />
      </div>

      <!-- Main Visual Section -->
      <div class="grid gap-8 lg:grid-cols-12">
        <!-- Collection Trend Chart -->
        <AppCard
          class="lg:col-span-8"
          padded
        >
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold font-display">
              Collection Trend
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mr-2">Interval:</span>
              <select class="bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>
          
          <div class="h-80 w-full relative group">
            <!-- Professional SVG Chart -->
            <svg
              viewBox="0 0 800 240"
              class="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient
                  id="chartGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style="stop-color:#7c3aed;stop-opacity:0.15"
                  />
                  <stop
                    offset="100%"
                    style="stop-color:#7c3aed;stop-opacity:0"
                  />
                </linearGradient>
              </defs>
              <!-- Grid Lines -->
              <g
                class="text-slate-100 stroke-current"
                stroke-dasharray="4,4"
              >
                <line
                  x1="0"
                  y1="40"
                  x2="800"
                  y2="40"
                />
                <line
                  x1="0"
                  y1="90"
                  x2="800"
                  y2="90"
                />
                <line
                  x1="0"
                  y1="140"
                  x2="800"
                  y2="140"
                />
                <line
                  x1="0"
                  y1="190"
                  x2="800"
                  y2="190"
                />
              </g>
              <!-- Area Path -->
              <path
                d="M0,200 L0,180 Q100,120 200,140 T400,90 T600,110 T800,50 L800,240 L0,240 Z"
                fill="url(#chartGradient)"
              />
              <!-- Line Path -->
              <path
                d="M0,180 Q100,120 200,140 T400,90 T600,110 T800,50"
                fill="none"
                stroke="#7c3aed"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <!-- Data Points -->
              <g
                v-for="(p, i) in [[0,180], [200,140], [400,90], [600,110], [800,50]]"
                :key="i"
              >
                <circle
                  :cx="p[0]"
                  :cy="p[1]"
                  r="8"
                  fill="white"
                  stroke="#7c3aed"
                  stroke-width="3"
                  class="drop-shadow-sm"
                />
              </g>
            </svg>
            <!-- X-Axis Labels -->
            <div class="flex justify-between mt-6 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
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
        <AppCard
          padded
          class="lg:col-span-4"
        >
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold font-display">
              Recent Activity
            </h3>
            <button class="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors uppercase tracking-widest">
              View all
            </button>
          </div>
          
          <div class="space-y-8">
            <div
              v-for="(act, i) in activities"
              :key="i"
              class="flex gap-4 relative pb-8 last:pb-0"
            >
              <div
                v-if="i < activities.length - 1"
                class="absolute left-5 top-10 bottom-0 w-px bg-slate-100"
              />
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 z-10 shadow-soft"
                :class="act.colorClass"
              >
                <component
                  :is="act.icon"
                  class="w-5 h-5"
                />
              </div>
              <div class="flex-1 pt-0.5">
                <p class="text-sm font-bold text-slate-900 leading-tight">
                  {{ act.title }}
                </p>
                <p class="text-xs text-slate-600 mt-1">
                  {{ act.subtitle }}
                </p>
              </div>
              <span class="text-[10px] font-bold text-slate-300 uppercase tracking-tighter whitespace-nowrap pt-1">
                {{ act.time }}
              </span>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Secondary Info Section -->
      <div class="grid gap-8 lg:grid-cols-12">
        <!-- Top Events -->
        <AppCard
          class="lg:col-span-4"
          padded
        >
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold font-display">
              Top Events by Amount
            </h3>
            <button class="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors uppercase tracking-widest">
              View all
            </button>
          </div>
          <div class="space-y-6">
            <div
              v-for="(event, i) in topEvents"
              :key="i"
              class="flex items-center gap-4 group cursor-pointer"
            >
              <div class="text-xs font-black text-slate-300 w-4">
                {{ i + 1 }}
              </div>
              <div class="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 border border-slate-200">
                <img
                  :src="event.image"
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-slate-800 group-hover:text-violet-600 transition-colors truncate">
                  {{ event.name }}
                </h4>
                <div class="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    class="bg-violet-500 h-full rounded-full transition-all duration-1000"
                    :style="{ width: event.percentage + '%' }"
                  />
                </div>
              </div>
              <div class="text-sm font-bold text-slate-900">
                ${{ event.amount }}
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Payment Methods -->
        <AppCard
          class="lg:col-span-4"
          padded
        >
          <h3 class="text-lg font-bold font-display mb-8">
            Payment Methods
          </h3>
          <div class="flex flex-col items-center">
            <div class="relative w-48 h-48">
              <svg
                viewBox="0 0 100 100"
                class="w-full h-full rotate-[-90deg]"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#7c3aed"
                  stroke-width="15"
                  stroke-dasharray="125 251"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10b981"
                  stroke-width="15"
                  stroke-dasharray="62 251"
                  stroke-dashoffset="-125"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f59e0b"
                  stroke-width="15"
                  stroke-dasharray="38 251"
                  stroke-dashoffset="-187"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#3b82f6"
                  stroke-width="15"
                  stroke-dasharray="26 251"
                  stroke-dashoffset="-225"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xl font-bold text-slate-900">100%</span>
                <span class="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Processed</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-x-8 gap-y-4 mt-8 w-full">
              <div
                v-for="method in paymentMethods"
                :key="method.label"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-2.5 h-2.5 rounded-full"
                    :style="{ backgroundColor: method.color }"
                  />
                  <span class="text-xs font-bold text-slate-600">{{ method.label }}</span>
                </div>
                <span class="text-xs font-bold text-slate-600">{{ method.percent }}%</span>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Upcoming Events -->
        <AppCard
          class="lg:col-span-4"
          padded
        >
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold font-display">
              Upcoming Events
            </h3>
            <button class="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors uppercase tracking-widest">
              View all
            </button>
          </div>
          <div class="space-y-6">
            <div
              v-for="(event, i) in upcomingEvents"
              :key="i"
              class="flex gap-4 group cursor-pointer"
            >
              <div class="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 border border-slate-200 shadow-soft">
                <img
                  :src="event.image"
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-slate-900 truncate group-hover:text-violet-600 transition-colors">
                  {{ event.name }}
                </h4>
                <div class="flex items-center gap-2 text-xs text-slate-600 mt-1 font-medium">
                  <Calendar class="w-3 h-3" />
                  <span>{{ event.date }}</span>
                </div>
                <div class="mt-2">
                  <span class="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
                    In {{ event.daysLeft }} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Third Row -->
      <div class="grid gap-8 lg:grid-cols-12">
        <!-- Top Collectors -->
        <AppCard
          class="lg:col-span-8"
          padded
        >
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold font-display">
              Top Collectors
            </h3>
            <button class="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors uppercase tracking-widest">
              View all
            </button>
          </div>
          <div class="grid gap-6 sm:grid-cols-2">
            <div
              v-for="(col, i) in topCollectors"
              :key="i"
              class="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-violet-100 hover:bg-violet-50/30 transition-all group"
            >
              <div class="text-xs font-black text-slate-300 w-4">
                {{ i + 1 }}
              </div>
              <div class="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-soft relative">
                <img
                  :src="col.avatar"
                  class="w-full h-full object-cover"
                >
                <div class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-slate-900 truncate">
                  {{ col.name }}
                </h4>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex-1 bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-violet-500"
                      :style="{ width: col.progress + '%' }"
                    />
                  </div>
                  <span class="text-xs font-bold text-slate-700">${{ col.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- CTA Card -->
        <div class="lg:col-span-4 relative group overflow-hidden rounded-[2rem] bg-navy-950 p-8 flex flex-col justify-between shadow-premium border border-navy-900">
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/20 blur-[80px] rounded-full group-hover:bg-violet-500/30 transition-all duration-700" />
          <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700" />
          
          <div class="relative z-10">
            <h3 class="text-xl font-bold font-display text-white leading-tight">
              Grow Your Impact
            </h3>
            <p class="text-slate-300 text-sm mt-3 leading-relaxed">
              Invite collectors and reach more people together.
            </p>
          </div>

          <div class="relative z-10 flex flex-col gap-6">
            <div class="flex -space-x-3">
              <div
                v-for="i in 4"
                :key="i"
                class="w-10 h-10 rounded-xl border-2 border-navy-950 overflow-hidden ring-1 ring-white/10 bg-slate-800 flex items-center justify-center"
              >
                <span
                  v-if="i === 4"
                  class="text-[10px] font-bold text-violet-400"
                >+12</span>
                <div
                  v-else
                  class="w-full h-full bg-slate-700 animate-pulse"
                />
              </div>
            </div>
            <AppButton
              variant="primary"
              class="w-full py-3 shadow-xl shadow-violet-500/20"
            >
              Invite Collectors
            </AppButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from '../composables/useDashboard'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import { 
  Calendar, 
  Plus, 
  ChevronDown, 
  Wallet, 
  Heart, 
  ShieldCheck
} from 'lucide-vue-next'

const query = useDashboard()

const activities = [
  { title: 'Payment received for "Youth Conference"', subtitle: '$250.00 via Paystack', time: '2m ago', icon: Wallet, colorClass: 'bg-emerald-50 text-emerald-600' },
  { title: 'New contribution recorded', subtitle: '$100.00 by John Doe', time: '15m ago', icon: Heart, colorClass: 'bg-violet-50 text-violet-600' },
  { title: 'Settlement completed', subtitle: '$1,250.00 to Main Account', time: '1h ago', icon: ShieldCheck, colorClass: 'bg-blue-50 text-blue-600' },
  { title: 'Self donation received', subtitle: '$50.00 by Isaac Botchway', time: '2h ago', icon: Heart, colorClass: 'bg-red-50 text-red-600' },
  { title: 'New event created: "Missions Outreach"', subtitle: 'Added by Admin', time: '3h ago', icon: Calendar, colorClass: 'bg-amber-50 text-amber-600' },
]

const topEvents = [
  { name: 'Youth Conference 2026', amount: '8,450.00', percentage: 85, image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=100&h=100&fit=crop' },
  { name: 'Easter Retreat', amount: '6,220.50', percentage: 65, image: 'https://images.unsplash.com/photo-1467307983825-619715426c70?w=100&h=100&fit=crop' },
  { name: 'Missions Outreach', amount: '4,310.00', percentage: 45, image: 'https://images.unsplash.com/photo-1541976535033-44701cd71512?w=100&h=100&fit=crop' },
  { name: 'Building Project', amount: '2,890.00', percentage: 30, image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=100&h=100&fit=crop' },
]

const paymentMethods = [
  { label: 'Card Payments', percent: 50.6, color: '#7c3aed' },
  { label: 'Mobile Money', percent: 33.0, color: '#10b981' },
  { label: 'Bank Transfer', percent: 14.0, color: '#f59e0b' },
  { label: 'Cash', percent: 2.4, color: '#3b82f6' },
]

const upcomingEvents = [
  { name: 'Youth Conference 2026', date: 'May 15 - May 18, 2026', daysLeft: 22, image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=200&h=200&fit=crop' },
  { name: 'Missions Outreach', date: 'Jun 5 - Jun 12, 2026', daysLeft: 43, image: 'https://images.unsplash.com/photo-1541976535033-44701cd71512?w=200&h=200&fit=crop' },
  { name: 'Community Outreach', date: 'Jul 20 - Jul 25, 2026', daysLeft: 88, image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=200&h=200&fit=crop' },
]

const topCollectors = [
  { name: 'Sarah Johnson', amount: '3,450.00', progress: 85, avatar: 'https://i.pravatar.cc/100?u=sarah' },
  { name: 'Michael Addo', amount: '2,890.50', progress: 70, avatar: 'https://i.pravatar.cc/100?u=michael' },
  { name: 'Grace Mensah', amount: '2,340.00', progress: 55, avatar: 'https://i.pravatar.cc/100?u=grace' },
  { name: 'David Osei', amount: '1,980.00', progress: 45, avatar: 'https://i.pravatar.cc/100?u=david' },
]
</script>
