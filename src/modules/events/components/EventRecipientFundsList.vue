<template>
  <div class="space-y-4">
    <div
      v-if="isLoading"
      class="flex items-center gap-3 py-4"
    >
      <Loader2 class="w-4 h-4 animate-spin text-slate-400" />
      <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing funds...</span>
    </div>
    <div
      v-else-if="isError"
      class="py-4 text-[10px] font-black uppercase tracking-widest text-red-500"
    >
      Failed to load funds.
    </div>
    <div
      v-else-if="funds.length === 0"
      class="py-8 text-center rounded-none border border-dashed border-slate-200"
    >
      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
        No recipient funds defined
      </p>
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      <div
        v-for="fund in funds"
        :key="fund.id"
        class="p-5 rounded-none border border-slate-100 bg-white hover:border-violet-100 transition-colors"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-xs font-black text-slate-900 tracking-tight uppercase leading-none">
              {{ fund.name }}
            </p>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">
              Financial Target
            </p>
          </div>
          <div class="text-right">
            <div class="flex flex-col items-end gap-1">
              <p
                v-for="t in fund.totals"
                :key="t.currency"
                class="text-xs font-black text-slate-900 italic tracking-tight leading-none"
              >
                {{ formatCurrency(t.amount, t.currency) }}
              </p>
              <p
                v-if="!fund.totals?.length"
                class="text-xs font-black text-slate-900 italic leading-none"
              >
                GHS 0.00
              </p>
            </div>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">
              Raised
            </p>
          </div>
        </div>

        <div v-if="fund.targetAmount > 0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
            <span class="text-[9px] font-black text-slate-900">{{ calculateProgress(fund) }}%</span>
          </div>
          <div class="h-1 w-full bg-slate-50 border border-slate-100 overflow-hidden">
            <div 
              class="h-full bg-emerald-500 transition-all duration-1000"
              :style="{ width: `${calculateProgress(fund)}%` }"
            />
          </div>
        </div>
        <div 
          v-else 
          class="pt-3 border-t border-slate-50 mt-1"
        >
          <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Open Target Scope</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'
import { formatCurrency } from '@/core/formatting/formatters'

const props = defineProps<{
  eventId: string
}>()

const funds = ref<RecipientFund[]>([])
const isLoading = ref(true)
const isError = ref(false)

onMounted(async () => {
  try {
    funds.value = await recipientFundsService.listByEvent(props.eventId)
  } catch (err) {
    console.error('Failed to fetch funds:', err)
    isError.value = true
  } finally {
    isLoading.value = false
  }
})
function calculateProgress(fund: RecipientFund) {
  if (!fund.targetAmount || !fund.totals?.length) return 0
  const ghsTotal = fund.totals.find(t => t.currency === 'GHS')?.amount ?? 0
  return Math.min(100, Math.round((ghsTotal / fund.targetAmount) * 100))
}
</script>
