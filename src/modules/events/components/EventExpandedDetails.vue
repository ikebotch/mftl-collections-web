<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 py-4 animate-in fade-in slide-in-from-top-2 duration-500">
    <!-- 1. Funds Summary -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Target class="w-3 h-3 text-violet-500" />
          Fund Distribution
        </h4>
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ funds.length }} Active</span>
      </div>
      
      <div class="space-y-3">
        <div 
          v-for="fund in funds" 
          :key="fund.id"
          class="p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:border-violet-100 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-black text-slate-900 tracking-tight">{{ fund.name }}</p>
            <div class="text-right">
              <p v-for="t in fund.totals" :key="t.currency" class="text-[11px] font-black text-slate-900 italic">
                {{ formatCurrency(t.amount, t.currency) }}
              </p>
            </div>
          </div>
          <div v-if="fund.targetAmount > 0" class="space-y-1.5">
            <div class="flex justify-between text-[9px] font-bold">
              <span class="text-slate-400">Progress</span>
              <span class="text-slate-900">{{ calculateProgress(fund) }}%</span>
            </div>
            <div class="h-1 w-full bg-white rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full" :style="{ width: `${calculateProgress(fund)}%` }" />
            </div>
          </div>
        </div>
        
        <div v-if="!funds.length" class="p-8 text-center rounded-xl border border-dashed border-slate-200">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No funds allocated</p>
        </div>
      </div>
    </div>

    <!-- 2. Collectors Summary -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Users class="w-3 h-3 text-amber-500" />
          Field Agents
        </h4>
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ collectors.length }} Active</span>
      </div>
      
      <div class="space-y-3">
        <div 
          v-for="collector in collectors" 
          :key="collector.id"
          class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/50"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
              {{ collector.name.charAt(0) }}
            </div>
            <div>
              <p class="text-[11px] font-black text-slate-900 tracking-tight">{{ collector.name }}</p>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ collector.assignmentCount || 0 }} Assignments</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-slate-900 italic">{{ collector.totalCollected || 'GHS 0.00' }}</p>
          </div>
        </div>
        
        <div v-if="!collectors.length" class="p-8 text-center rounded-xl border border-dashed border-slate-200">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No agents assigned</p>
        </div>
      </div>
    </div>

    <!-- 3. Recent Collections -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Activity class="w-3 h-3 text-emerald-500" />
          Recent Stream
        </h4>
      </div>
      
      <div class="space-y-2">
        <div 
          v-for="log in activity" 
          :key="log.id"
          class="p-3 rounded-xl border border-slate-100 bg-white shadow-soft group hover:border-violet-100 transition-all"
        >
          <div class="flex items-center justify-between">
            <p class="text-[11px] font-black text-slate-900 tracking-tight">{{ log.contributorName }}</p>
            <p class="text-[11px] font-black text-slate-900 italic">{{ formatCurrency(log.amount, log.currency) }}</p>
          </div>
          <div class="flex items-center justify-between mt-1">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ log.paymentMethod }}</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ formatDate(log.date) }}</span>
          </div>
        </div>
        
        <div v-if="!activity.length" class="p-8 text-center rounded-xl border border-dashed border-slate-200">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No recent stream</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Target, Users, Activity } from 'lucide-vue-next'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { formatCurrency, formatDate } from '@/core/formatting/formatters'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'

const props = defineProps<{
  eventId: string
}>()

const funds = ref<RecipientFund[]>([])
const collectors = ref<any[]>([]) // Placeholder for now
const activity = ref<any[]>([]) // Placeholder for now

onMounted(async () => {
  try {
    // Load real funds
    funds.value = await recipientFundsService.listByEvent(props.eventId)
    
    // In a real app, we would load collectors and recent activity here
    // For now, these are placeholder arrays that will show the "No activity" state
    // unless the backend provided them in the event detail response
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
