<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Reports"
      description="Performance analytics, financial trends, and event-based collection reporting."
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="!rounded-none bg-white shadow-sm border-slate-200"
          >
            <Download class="w-4 h-4 mr-2 text-slate-400" />
            Generate PDF
          </AppButton>
          <AppButton 
            variant="primary"
            class="!rounded-none shadow-premium"
          >
            <Share2 class="w-4 h-4 mr-2" />
            Export Data
          </AppButton>
        </div>
      </template>
    </AdminPageHeader>

    <AdminMetricGrid>
      <MetricCard
        label="Total Raised"
        :value="formatCurrency(totalRaised, 'GHS')"
        icon="TrendingUp"
        color="purple"
      />
      <MetricCard
        label="Avg Contribution"
        :value="formatCurrency(avgContribution, 'GHS')"
        icon="DollarSign"
        color="blue"
      />
      <MetricCard
        label="Retention Rate"
        value="84.2%"
        icon="Users"
        color="green"
      />
      <MetricCard
        label="Failed Velocity"
        value="1.4%"
        icon="AlertTriangle"
        color="red"
      />
    </AdminMetricGrid>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Method Breakdown -->
      <AppCard class="lg:col-span-4 !p-8 space-y-8">
        <div class="space-y-2">
          <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Channel Mix
          </h3>
          <p class="text-sm font-black text-slate-900 tracking-tight italic">
            Aggregated across all active events
          </p>
        </div>
        
        <div class="space-y-8">
          <div
            v-for="(val, method) in methodBreakdown"
            :key="method"
            class="space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ method }}</span>
              <span class="text-xs font-black text-slate-900 italic">{{ formatCurrency(val, 'GHS') }}</span>
            </div>
            <ProgressBar 
              :value="val"
              :max="totalRaised"
              color="emerald"
            />
          </div>
        </div>
      </AppCard>

      <!-- Event Performance -->
      <AppCard class="lg:col-span-8 !p-8 space-y-8">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Event Impact Ledger
            </h3>
            <p class="text-sm font-black text-slate-900 tracking-tight italic">
              Top performing campaigns
            </p>
          </div>
          <span class="flex items-center gap-1.5 px-3 py-1 rounded-none bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-100">
            <span class="w-1.5 h-1.5 rounded-none bg-violet-500 animate-pulse" />
            Live Updates
          </span>
        </div>
        
        <div class="grid gap-4">
          <div
            v-for="event in eventPerformance"
            :key="event.title"
            class="flex items-center justify-between p-6 rounded-none bg-slate-50 border border-slate-100 group hover:border-slate-900 transition-all cursor-pointer"
          >
            <div class="flex items-center gap-5">
              <div class="w-12 h-12 rounded-none bg-white border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                <Calendar class="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p class="text-sm font-black text-slate-900 tracking-tight">
                  {{ event.title }}
                </p>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {{ event.count }} Contributions Recorded
                </p>
              </div>
            </div>
            <div class="text-right space-y-1">
              <p class="text-base font-black text-slate-900 italic">
                {{ formatCurrency(event.total, 'GHS') }}
              </p>
              <div class="flex items-center justify-end gap-2">
                <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{{ event.percent }}% of Target</span>
                <div class="w-12 bg-slate-200 h-1 rounded-none overflow-hidden">
                  <div
                    class="h-full bg-emerald-500"
                    :style="{ width: event.percent + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContributions } from '@/modules/contributions/composables/useContributions'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ProgressBar from '@/shared/components/feedback/ProgressBar.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { 
  Download, 
  Share2, 
  Calendar
} from 'lucide-vue-next'

const query = useContributions()
const contributions = computed(() => query.data.value || [])

const totalRaised = computed(() => {
  return contributions.value.reduce((acc, c) => acc + c.amountValue, 0)
})

const avgContribution = computed(() => {
  if (contributions.value.length === 0) return 0
  return totalRaised.value / contributions.value.length
})

const methodBreakdown = computed(() => {
  const breakdown: Record<string, number> = {
    'Cash': 0,
    'Card': 0,
    'Mobile Money': 0
  }
  
  contributions.value.forEach(c => {
    const amount = c.amountValue
    const method = c.paymentMethod === 'MoMo' ? 'Mobile Money' : (c.paymentMethod || 'Other')
    if (!breakdown[method]) breakdown[method] = 0
    breakdown[method] += amount
  })
  
  return breakdown
})

const eventPerformance = computed(() => {
  const events: Record<string, { total: number, count: number }> = {}
  
  contributions.value.forEach(c => {
    const eventTitle = c.event || 'Legacy Campaign'
    const amount = c.amountValue
    
    if (!events[eventTitle]) events[eventTitle] = { total: 0, count: 0 }
    events[eventTitle].total += amount
    events[eventTitle].count++
  })
  
  return Object.entries(events).map(([title, data]) => ({
    title,
    total: data.total,
    count: data.count,
    percent: Math.min(100, Math.round((data.total / (totalRaised.value || 1)) * 100))
  })).sort((a, b) => b.total - a.total).slice(0, 4)
})
</script>
