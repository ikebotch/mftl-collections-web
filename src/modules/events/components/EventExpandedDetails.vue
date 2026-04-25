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
      
      <div class="space-y-4">
        <div 
          v-for="fund in funds" 
          :key="fund.id"
          class="p-6 rounded-2xl bg-white border border-slate-100 hover:border-violet-200 transition-all shadow-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xs font-black text-slate-900 tracking-tight">
                {{ fund.name }}
              </p>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {{ fund.collectorCount || 0 }} Collectors Assigned
              </p>
            </div>
            <div class="text-right">
              <div
                v-if="fund.totals?.length"
                class="space-y-0.5"
              >
                <p
                  v-for="t in fund.totals"
                  :key="t.currency"
                  class="text-[11px] font-black text-slate-900 italic"
                >
                  {{ formatCurrency(t.amount, t.currency) }} <span class="text-slate-400 font-bold not-italic">/ {{ fund.targetAmount > 0 ? formatCurrency(fund.targetAmount, t.currency) : 'No target set' }}</span>
                </p>
              </div>
              <p
                v-else
                class="text-[11px] font-black text-slate-400 italic"
              >
                GHS 0.00 <span class="text-slate-300 font-bold not-italic">/ {{ fund.targetAmount > 0 ? formatCurrency(fund.targetAmount, 'GHS') : 'No target set' }}</span>
              </p>
            </div>
          </div>
          
          <div
            v-if="fund.targetAmount > 0"
            class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden"
          >
            <div 
              class="h-full rounded-full transition-all duration-1000" 
              :class="calculateProgress(fund) > 50 ? 'bg-emerald-500' : 'bg-violet-500'" 
              :style="{ width: `${calculateProgress(fund)}%` }" 
            />
          </div>
        </div>
        
        <div
          v-if="!funds.length"
          class="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/30"
        >
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            No funds allocated to this event
          </p>
        </div>
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
      
      <div class="space-y-3">
        <div 
          v-for="collector in collectors" 
          :key="collector.id"
          class="group p-4 rounded-xl bg-white border border-slate-100 hover:border-amber-200 transition-all flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                {{ collector.name.charAt(0) }}
              </div>
              <div 
                class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                :class="collector.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'"
              />
            </div>
            <div>
              <p class="text-sm font-black text-slate-900 tracking-tight">
                {{ collector.name }}
              </p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {{ collector.assignedFundName || 'Primary Fund' }} | {{ collector.totalCollectedFormatted || 'GHS 0.00' }} / {{ collector.limitFormatted || 'No limit' }}
              </p>
            </div>
          </div>
          <ChevronRight class="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div
          v-if="!collectors.length"
          class="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/30"
        >
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            No agents assigned to this event
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

function calculateProgress(fund: RecipientFund) {
  if (!fund.targetAmount || !fund.totals?.length) return 0
  const ghsTotal = fund.totals.find(t => t.currency === 'GHS')?.amount ?? 0
  return Math.min(100, Math.round((ghsTotal / fund.targetAmount) * 100))
}
</script>
