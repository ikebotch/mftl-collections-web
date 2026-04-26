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
        :value="formattedTotalRaised"
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

    <!-- Operational Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Method Breakdown -->
      <AppCard class="lg:col-span-5 !p-8 space-y-8 border-slate-200/60 bg-white/40">
        <div class="space-y-2">
          <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Channel Mix
          </h3>
          <p class="text-sm font-black text-slate-900 tracking-tight italic">
            Aggregated across all active events
          </p>
        </div>
        
        <div class="flex flex-col gap-1.5">
          <div 
            v-for="(amts, method) in methodBreakdown" 
            :key="method"
            class="space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ method }}</span>
              <div class="flex flex-col items-end">
                <span 
                  v-for="(amt, curr) in amts" 
                  :key="curr"
                  class="text-[10px] font-black text-slate-900 italic"
                >
                  {{ formatCurrency(amt, curr) }}
                </span>
              </div>
            </div>
            <ProgressBar 
              :value="Object.values(amts)[0] || 0"
              :max="Object.values(totalsByCurrency)[0] || 1"
              color="purple"
            />
          </div>
        </div>
      </AppCard>

      <!-- Event Performance Ledger -->
      <div class="lg:col-span-7 space-y-6">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Campaign Ledger</h3>
            <p class="text-xs font-bold text-slate-900 mt-1 uppercase tracking-tight italic">Performance Audit across active nodes</p>
          </div>
        </div>
        <DataTable
          :columns="[
            { key: 'title', label: 'Campaign' },
            { key: 'count', label: 'Contributions' },
            { key: 'total', label: 'Total Raised' }
          ]"
          :rows="eventPerformance.map(e => ({
            ...e,
            total: Object.entries(e.totals).map(([curr, amt]) => formatCurrency(amt, curr)).join(' • ')
          }))"
          class="!border-slate-200/60 shadow-none bg-white/40"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContributions } from '@/modules/contributions/composables/useContributions'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ProgressBar from '@/shared/components/feedback/ProgressBar.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { 
  Download, 
  Share2, 
  Calendar,
  PieChart
} from 'lucide-vue-next'

const query = useContributions()
const contributions = computed(() => query.data.value || [])
const searchQuery = ref('')
const timeRange = ref('30d')

const reportColumns = [
  { key: 'title', label: 'Campaign' },
  { key: 'total', label: 'Aggregated' },
  { key: 'percent', label: 'Velocity' }
]

const totalsByCurrency = computed(() => {
  const map: Record<string, number> = {}
  contributions.value.forEach(c => {
    map[c.currency] = (map[c.currency] || 0) + c.amountValue
  })
  return map
})

const formattedTotalRaised = computed(() => {
  const entries = Object.entries(totalsByCurrency.value)
  if (entries.length === 0) return 'GHS 0.00'
  return entries.map(([curr, amt]) => formatCurrency(amt, curr)).join(' • ')
})

const avgContribution = computed(() => {
  if (contributions.value.length === 0) return 0
  const mainCurrency = Object.keys(totalsByCurrency.value)[0] || 'GHS'
  const total = totalsByCurrency.value[mainCurrency] || 0
  const count = contributions.value.filter(c => c.currency === mainCurrency).length
  return count > 0 ? total / count : 0
})

const methodBreakdown = computed(() => {
  const breakdown: Record<string, Record<string, number>> = {}
  
  contributions.value.forEach(c => {
    const method = c.paymentMethod === 'MoMo' ? 'Mobile Money' : (c.paymentMethod || 'Other')
    if (!breakdown[method]) breakdown[method] = {}
    breakdown[method][c.currency] = (breakdown[method][c.currency] || 0) + c.amountValue
  })
  
  return breakdown
})

const eventPerformance = computed(() => {
  const events: Record<string, { totals: Record<string, number>, count: number }> = {}
  
  contributions.value.forEach(c => {
    const eventTitle = c.event || 'Legacy Campaign'
    if (!events[eventTitle]) events[eventTitle] = { totals: {}, count: 0 }
    events[eventTitle].totals[c.currency] = (events[eventTitle].totals[c.currency] || 0) + c.amountValue
    events[eventTitle].count++
  })
  
  return Object.entries(events).map(([title, data]) => {
    const mainCurrency = Object.keys(data.totals)[0] || 'GHS'
    const totalForPercent = data.totals[mainCurrency] || 0
    const globalTotalForPercent = totalsByCurrency.value[mainCurrency] || 1
    
    return {
      title,
      totals: data.totals,
      count: data.count,
      percent: Math.min(100, Math.round((totalForPercent / globalTotalForPercent) * 100))
    }
  }).sort((a, b) => {
    const valA = Object.values(a.totals)[0] || 0
    const valB = Object.values(b.totals)[0] || 0
    return valB - valA
  }).slice(0, 8)
})
</script>
