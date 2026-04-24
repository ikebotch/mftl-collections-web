<template>
  <div class="space-y-12">
    <!-- Editorial Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-2 h-10 bg-violet-600" />
          <h1 class="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Intelligence
          </h1>
        </div>
        <p class="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-5">
          Performance Analytics & Financial Reporting
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <AppButton
          variant="outline"
          class="!rounded-2xl !py-6 !px-8 border-2 border-slate-200 hover:border-slate-900 transition-all"
        >
          <Download class="w-4 h-4 mr-3" />
          <span class="font-black uppercase tracking-widest text-[10px]">Generate PDF</span>
        </AppButton>
        <AppButton 
          variant="primary"
          class="!rounded-2xl !py-6 !px-8 bg-slate-900 text-white shadow-2xl transition-all"
        >
          <Share2 class="w-4 h-4 mr-3" />
          <span class="font-black uppercase tracking-widest text-[10px]">Export Data</span>
        </AppButton>
      </div>
    </div>

    <!-- Summary KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        label="Total Raised"
        :value="formatCurrency(totalRaised, 'GHS')"
        icon="TrendingUp"
        color="purple"
        description="Gross collection value"
      />
      <MetricCard
        label="Avg Contribution"
        :value="formatCurrency(avgContribution, 'GHS')"
        icon="DollarSign"
        color="blue"
        description="Per unique receipt"
      />
      <MetricCard
        label="Retention Rate"
        value="84.2%"
        icon="Users"
        color="green"
        description="Recurring donor impact"
      />
      <MetricCard
        label="Failed Velocity"
        value="1.4%"
        icon="AlertTriangle"
        color="red"
        description="Payment decline rate"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Method Breakdown -->
      <AppCard class="lg:col-span-1 !rounded-[3rem] p-10 border-2 border-slate-100 shadow-xl bg-white flex flex-col justify-between">
        <div class="space-y-6">
          <h3 class="text-lg font-black text-slate-900 uppercase italic tracking-tight mb-8">
            Channel Mix
          </h3>
          <div class="space-y-8">
            <div
              v-for="(val, method) in methodBreakdown"
              :key="method"
              class="space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ method }}</span>
                <span class="text-xs font-black text-slate-900 italic">{{ formatCurrency(val, 'GHS') }}</span>
              </div>
              <div class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-slate-900 rounded-full transition-all duration-1000"
                  :style="{ width: `${(val / totalRaised) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </div>
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-12">
          Aggregated across all active events
        </p>
      </AppCard>

      <!-- Event Performance -->
      <AppCard class="lg:col-span-2 !rounded-[3rem] p-10 border-2 border-slate-100 shadow-xl bg-white">
        <div class="flex items-center justify-between mb-10">
          <h3 class="text-lg font-black text-slate-900 uppercase italic tracking-tight">
            Event Impact Ledger
          </h3>
          <span class="text-[10px] font-black text-violet-600 uppercase tracking-widest">Live Updates</span>
        </div>
        
        <div class="space-y-6">
          <div
            v-for="event in eventPerformance"
            :key="event.title"
            class="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-slate-900 transition-all"
          >
            <div class="flex items-center gap-5">
              <div class="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar class="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p class="text-base font-black text-slate-900 tracking-tight">
                  {{ event.title }}
                </p>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {{ event.count }} Contributions
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-black text-slate-900 italic">
                {{ formatCurrency(event.total, 'GHS') }}
              </p>
              <div class="flex items-center justify-end gap-1 mt-1">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{{ event.percent }}% of Goal</span>
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
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import { formatCurrency } from '@/shared/utils/formatters'
import { 
  Download, 
  Share2, 
  Calendar
} from 'lucide-vue-next'

const query = useContributions()
const contributions = computed(() => query.data.value || [])

const totalRaised = computed(() => {
  return contributions.value.reduce((acc, c) => acc + (typeof c.amount === 'number' ? c.amount : parseFloat(String(c.amount).replace(/[^0-9.]/g, ''))), 0)
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
    percent: Math.round((data.total / (totalRaised.value || 1)) * 100)
  })).sort((a, b) => b.total - a.total).slice(0, 4)
})
</script>
