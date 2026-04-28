<template>
  <div :class="isTab ? 'space-y-12' : 'space-y-10 pb-20'">
    <!-- Header (Hidden when used as a tab) -->
    <AdminPageHeader
      v-if="event && !isTab"
      :title="`${event.title} Analytics`"
      description="Deep-dive campaign performance, donor behavior, and fund velocity."
    >
      <template #actions>
        <AppButton
          variant="outline"
          class="bg-white"
          @click="router.push(`/admin/events/${eventId}`)"
        >
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Event
        </AppButton>
      </template>
    </AdminPageHeader>

    <div
      v-if="query.isLoading.value"
      class="py-32"
    >
      <LoadingState text="Synthesizing performance data..." />
    </div>

    <template v-else-if="event">
      <!-- High Level KPIs -->
      <AdminMetricGrid>
        <MetricCard
          label="Total Raised (GHS)"
          :value="formatCurrency(stats.totalGHS, 'GHS')"
          icon="TrendingUp"
          color="green"
          trend="+12% from last week"
        />
        <MetricCard
          label="Total Raised (USD)"
          :value="formatCurrency(stats.totalUSD, 'USD')"
          icon="Globe"
          color="violet"
          trend="New stream"
        />
        <MetricCard
          label="Donor Base"
          :value="String(stats.donorCount)"
          icon="Users"
          color="blue"
        />
        <MetricCard
          label="Avg. Contribution"
          :value="formatCurrency(stats.avgContribution, 'GHS')"
          icon="Zap"
          color="amber"
        />
      </AdminMetricGrid>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Main Performance Chart -->
        <AppCard class="lg:col-span-2 !p-12 border-slate-100">
          <div class="flex items-center justify-between mb-12">
            <div>
              <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Campaign Velocity
              </h3>
              <p class="text-xs font-bold text-slate-900 mt-1">
                Collections Trend over time
              </p>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-1 text-[8px] font-black uppercase tracking-widest bg-slate-900 text-white rounded-full">
                Daily
              </button>
              <button class="px-3 py-1 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                Weekly
              </button>
            </div>
          </div>
          
          <!-- Custom SVG Line Chart -->
          <div class="h-64 w-full relative pt-10">
            <svg class="w-full h-full overflow-visible">
              <defs>
                <linearGradient
                  id="chartGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stop-color="#7c3aed"
                    stop-opacity="0.1"
                  />
                  <stop
                    offset="100%"
                    stop-color="#7c3aed"
                    stop-opacity="0"
                  />
                </linearGradient>
              </defs>
              <!-- Grid Lines -->
              <line
                x1="0"
                y1="20%"
                x2="100%"
                y2="20%"
                stroke="#f1f5f9"
                stroke-dasharray="4"
              />
              <line
                x1="0"
                y1="40%"
                x2="100%"
                y2="40%"
                stroke="#f1f5f9"
                stroke-dasharray="4"
              />
              <line
                x1="0"
                y1="60%"
                x2="100%"
                y2="60%"
                stroke="#f1f5f9"
                stroke-dasharray="4"
              />
              <line
                x1="0"
                y1="80%"
                x2="100%"
                y2="80%"
                stroke="#f1f5f9"
                stroke-dasharray="4"
              />
              
              <!-- Area -->
              <path
                d="M 0 180 Q 50 140, 100 160 T 200 100 T 300 120 T 400 60 T 500 80 T 600 40 T 700 70 V 250 H 0 Z"
                fill="url(#chartGradient)"
                class="transition-all duration-1000"
              />
              
              <!-- Line -->
              <path
                d="M 0 180 Q 50 140, 100 160 T 200 100 T 300 120 T 400 60 T 500 80 T 600 40 T 700 70"
                fill="none"
                stroke="#7c3aed"
                stroke-width="3"
                stroke-linecap="round"
                class="transition-all duration-1000"
              />
              
              <!-- Dots -->
              <circle
                cx="200"
                cy="100"
                r="4"
                fill="white"
                stroke="#7c3aed"
                stroke-width="2"
                class="cursor-pointer hover:r-6 transition-all"
              />
              <circle
                cx="400"
                cy="60"
                r="4"
                fill="white"
                stroke="#7c3aed"
                stroke-width="2"
              />
              <circle
                cx="600"
                cy="40"
                r="4"
                fill="white"
                stroke="#7c3aed"
                stroke-width="2"
              />
            </svg>
            <div class="absolute bottom-[-24px] w-full flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest">
              <span>Launch</span>
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Now</span>
            </div>
          </div>
        </AppCard>

        <!-- Channel Mix -->
        <AppCard class="!p-12 border-slate-100">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-12">
            Channel Distribution
          </h3>
          <div class="space-y-10">
            <div
              v-for="channel in stats.channels"
              :key="channel.name"
              class="space-y-3"
            >
              <div class="flex justify-between items-end">
                <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">{{ channel.name }}</span>
                <span class="text-xs font-black text-slate-900">{{ channel.percentage }}%</span>
              </div>
              <div class="h-1.5 w-full bg-slate-100 rounded-none overflow-hidden">
                <div 
                  class="h-full bg-violet-600 transition-all duration-1000"
                  :style="{ width: `${channel.percentage}%` }"
                />
              </div>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {{ formatCurrency(channel.amount, 'GHS') }}
              </p>
            </div>
          </div>

          <div class="mt-16 p-6 bg-slate-50 border border-slate-100 rounded-none">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Zap class="w-5 h-5" />
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                  System insight
                </p>
                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  Mobile Money continues to be the primary growth driver for this campaign.
                </p>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Top Funds -->
        <AppCard class="!p-12 border-slate-100">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-12">
            Fund Performance
          </h3>
          <div class="space-y-8">
            <div 
              v-for="fund in stats.funds" 
              :key="fund.name"
              class="group cursor-pointer"
            >
              <div class="flex items-center gap-4 mb-3">
                <div class="w-8 h-8 rounded-none bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-violet-200 transition-colors">
                  {{ fund.name.charAt(0) }}
                </div>
                <div class="flex-1">
                  <p class="text-xs font-black text-slate-900 leading-none">
                    {{ fund.name }}
                  </p>
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                    {{ fund.count }} contributions
                  </p>
                </div>
                <p class="text-xs font-black text-slate-900">
                  {{ formatCurrency(fund.amount, 'GHS') }}
                </p>
              </div>
              <div class="h-1 w-full bg-slate-50 rounded-none overflow-hidden">
                <div 
                  class="h-full bg-slate-900 opacity-20 group-hover:opacity-100 transition-all duration-500"
                  :style="{ width: `${(fund.amount / stats.totalGHS) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Top Contributors -->
        <AppCard class="lg:col-span-2 !p-12 border-slate-100">
          <div class="flex items-center justify-between mb-12">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              High-Value Donors
            </h3>
            <AppButton
              variant="ghost"
              size="xs"
              class="text-[9px] uppercase tracking-widest font-black"
            >
              View All
            </AppButton>
          </div>
          <DataTable
            :columns="contributorColumns"
            :rows="stats.topDonors"
            class="!border-0 shadow-none"
          >
            <template #cell:donor="{ row }">
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                  {{ row.name.charAt(0) }}
                </div>
                <span class="text-xs font-black text-slate-900">{{ row.name }}</span>
              </div>
            </template>
            <template #cell:amount="{ value }">
              <span class="text-xs font-black text-slate-900 italic tracking-tight">{{ formatCurrency(value, 'GHS') }}</span>
            </template>
            <template #cell:status>
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span class="text-[9px] font-black text-slate-900 uppercase tracking-widest">Verified</span>
              </div>
            </template>
          </DataTable>
        </AppCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent } from '../composables/useEvents'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Zap, 
  Globe,
  ChevronDown
} from 'lucide-vue-next'

const props = defineProps<{
  isTab?: boolean
}>()

const route = useRoute()
const router = useRouter()
const eventId = computed(() => props.isTab ? (route.params.id as string) : (route.params.id as string))
const query = useEvent(eventId.value)
const event = computed(() => query.data.value)

const contributorColumns = [
  { key: 'donor', label: 'Donor' },
  { key: 'amount', label: 'Total Contribution' },
  { key: 'status', label: 'Status' }
]

// Synthesized Mock Stats for Premium Visuals
const stats = computed(() => ({
  totalGHS: 128450.75,
  totalUSD: 450.00,
  donorCount: 342,
  avgContribution: 375.50,
  channels: [
    { name: 'Mobile Money', percentage: 72, amount: 92484.54 },
    { name: 'Direct Cash', percentage: 18, amount: 23121.13 },
    { name: 'Card Payments', percentage: 10, amount: 12845.08 }
  ],
  funds: [
    { name: 'Clean Water Initiative', amount: 45200, count: 124 },
    { name: 'School Supplies', amount: 32100, count: 98 },
    { name: 'Medical Fund', amount: 28400, count: 65 },
    { name: 'General Support', amount: 22750, count: 55 }
  ],
  topDonors: [
    { name: 'Dr. Kwesi Mensah', amount: 15000, date: '2026-04-12' },
    { name: 'Abigail Boateng', amount: 12500, date: '2026-04-15' },
    { name: 'Organization X', amount: 8000, date: '2026-04-18' },
    { name: 'John Doe', amount: 5000, date: '2026-04-20' }
  ]
}))
</script>
