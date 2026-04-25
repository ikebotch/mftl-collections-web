<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 py-8 animate-in fade-in slide-in-from-top-2 duration-500">
    <!-- 1. Fund Distribution -->
    <div class="space-y-6">
      <div class="flex items-center justify-between px-1">
        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Target class="w-3.5 h-3.5 text-violet-500" />
          Fund Distribution
        </h4>
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ funds.length }} Active Targets</span>
      </div>
      
      <div class="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-100/30">
              <th class="px-6 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Fund Name</th>
              <th class="px-6 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Collectors</th>
              <th class="px-6 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Collected / Target</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="fund in funds" 
              :key="fund.id"
              class="group hover:bg-white transition-colors"
            >
              <td class="px-6 py-4">
                <p class="text-xs font-black text-slate-900 tracking-tight">{{ fund.name }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-bold text-slate-600">{{ fund.collectorCount || 0 }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col items-end gap-1.5">
                  <p class="text-[11px] font-black text-slate-900 italic">
                    {{ formatCurrency(getGhsTotal(fund), 'GHS') }} 
                    <span class="text-slate-400 font-bold not-italic">/ {{ fund.targetAmount > 0 ? formatCurrency(fund.targetAmount, 'GHS') : 'No target set' }}</span>
                  </p>
                  <div
                    v-if="fund.targetAmount > 0"
                    class="h-1 w-24 bg-slate-200 rounded-full overflow-hidden"
                  >
                    <div 
                      class="h-full rounded-full transition-all duration-1000" 
                      :class="getProgressColor(fund)" 
                      :style="{ width: `${calculateProgress(fund)}%` }" 
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="!funds.length">
              <td colspan="3" class="px-6 py-12 text-center">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No recipient funds assigned.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. Field Agents -->
    <div class="space-y-6">
      <div class="flex items-center justify-between px-1">
        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Users class="w-3.5 h-3.5 text-amber-500" />
          Field Agents
        </h4>
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ collectors.length }} Assigned</span>
      </div>
      
      <div class="space-y-2">
        <div 
          v-for="collector in collectors" 
          :key="collector.id"
          class="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 group hover:border-slate-200 transition-all"
        >
          <div class="flex items-center gap-3">
            <div 
              class="w-2 h-2 rounded-full"
              :class="collector.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
            />
            <p class="text-sm font-black text-slate-900 tracking-tight">{{ collector.name }}</p>
          </div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {{ collector.assignedFundName || 'Unassigned' }} | 
            <span class="text-slate-900 font-black italic">{{ collector.totalCollectedFormatted || 'GHS 0.00' }}</span> 
            <span class="text-slate-300">/ {{ collector.limitFormatted || '∞' }}</span>
          </p>
        </div>
        
        <div
          v-if="!collectors.length"
          class="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/30"
        >
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            No field agents assigned.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Target, Users, ChevronRight } from 'lucide-vue-next'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { formatCurrency } from '@/core/formatting/formatters'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'

const props = defineProps<{
  eventId: string
}>()

const funds = ref<RecipientFund[]>([])
const collectors = ref<any[]>([])

onMounted(async () => {
  try {
    funds.value = await recipientFundsService.listByEvent(props.eventId)
  } catch (err) {
    console.error('Failed to load expanded details:', err)
  }
})

function getGhsTotal(fund: RecipientFund) {
  return fund.totals?.find(t => t.currency === 'GHS')?.amount ?? 0
}

function calculateProgress(fund: RecipientFund) {
  if (!fund.targetAmount) return 0
  return Math.min(100, Math.round((getGhsTotal(fund) / fund.targetAmount) * 100))
}

function getProgressColor(fund: RecipientFund) {
  const progress = calculateProgress(fund)
  if (progress >= 50) return 'bg-emerald-500'
  if (progress > 0) return 'bg-amber-500'
  return 'bg-slate-300'
}
</script>
