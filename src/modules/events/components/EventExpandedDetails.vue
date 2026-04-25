<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 py-10 animate-in fade-in slide-in-from-top-2 duration-500">
    <!-- 1. Fund Distribution -->
    <div class="space-y-8">
      <div class="flex items-center justify-between px-1">
        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Target class="w-3.5 h-3.5 text-violet-500" />
          Fund Distribution
        </h4>
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ funds.length }} Active Targets</span>
      </div>
      
      <div class="overflow-hidden rounded-none border border-slate-200 bg-transparent">
        <table class="w-full text-left border-collapse">
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="fund in funds" 
              :key="fund.id"
              class="group hover:bg-slate-50/30 transition-colors"
            >
              <td class="px-6 py-5">
                <p class="text-xs font-black text-slate-900 tracking-tight">{{ fund.name }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ fund.collectorCount || 0 }} Collectors Assigned</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col items-end gap-2.5">
                  <p class="text-[11px] font-black text-slate-900 italic tracking-tight leading-none">
                    {{ formatCurrency(getGhsTotal(fund), 'GHS') }} 
                    <span class="text-slate-400 font-bold not-italic ml-1">/ {{ fund.targetAmount > 0 ? formatCurrency(fund.targetAmount, 'GHS') : '∞' }}</span>
                  </p>
                  <div
                    v-if="fund.targetAmount > 0"
                    class="h-1 w-24 bg-slate-100 rounded-none overflow-hidden border border-slate-200/50"
                  >
                    <div 
                      class="h-full transition-all duration-1000" 
                      :class="getProgressColor(fund)" 
                      :style="{ width: `${calculateProgress(fund)}%` }" 
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="!funds.length">
              <td colspan="2" class="px-6 py-16 text-center">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">No recipient funds assigned to this event.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. Field Agents -->
    <div class="space-y-8">
      <div class="flex items-center justify-between px-1">
        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Users class="w-3.5 h-3.5 text-amber-500" />
          Field Operations
        </h4>
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ collectors.length }} Staff Assigned</span>
      </div>
      
      <div class="space-y-3">
        <div 
          v-for="collector in collectors" 
          :key="collector.id"
          class="flex items-center justify-between p-5 rounded-none bg-transparent border border-slate-100 group hover:border-slate-300 transition-all duration-500"
        >
          <div class="flex items-center gap-4">
            <!-- Status Circle -->
            <div 
              class="w-2.5 h-2.5 rounded-full"
              :class="collector.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
            />
            <div>
              <p class="text-sm font-black text-slate-900 tracking-tight leading-none">{{ collector.name }}</p>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-none">
                {{ collector.email }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs font-black text-slate-900 italic tracking-tight leading-none">
              {{ formatCurrency(collector.totalCollectedToday, 'GHS') }}
            </p>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">
              Raised Today
            </p>
          </div>
        </div>
        
        <div
          v-if="!collectors.length && !loading"
          class="p-12 text-center rounded-none border border-slate-200 bg-slate-50/10 flex flex-col items-center gap-4"
        >
          <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <Users class="w-5 h-5 text-slate-300" />
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
            No field agents have been provisioned for this event.
          </p>
          <AppButton 
            variant="ghost" 
            size="xs" 
            class="text-[9px] font-black uppercase tracking-widest border border-slate-200"
            @click="router.push('/admin/collectors/new')"
          >
            Deploy Staff
          </AppButton>
        </div>

        <div v-if="loading" class="py-12 flex justify-center">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Target, Users } from 'lucide-vue-next'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { collectorService } from '@/modules/collector/services/collectorService'
import { formatCurrency } from '@/core/formatting/formatters'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'
import type { CollectorProfile } from '@/modules/collector/types/collector'
import AppButton from '@/shared/components/buttons/AppButton.vue'

const props = defineProps<{
  eventId: string
}>()

const router = useRouter()
const funds = ref<RecipientFund[]>([])
const collectors = ref<CollectorProfile[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [fundList, collectorList] = await Promise.all([
      recipientFundsService.listByEvent(props.eventId),
      collectorService.listAll({ eventId: props.eventId })
    ])
    funds.value = fundList
    collectors.value = collectorList
  } catch (err) {
    console.error('Failed to load expanded details:', err)
  } finally {
    loading.value = false
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
