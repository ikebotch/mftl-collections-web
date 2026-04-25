<template>
  <div class="space-y-6">
    <div
      v-if="isLoading"
      class="flex items-center gap-4 py-8"
    >
      <Loader2 class="w-4 h-4 animate-spin text-slate-400" />
      <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Funds...</span>
    </div>
    <div
      v-else-if="isError"
      class="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500"
    >
      Failed to establish connection to fund service.
    </div>
    <div
      v-else-if="funds.length === 0"
      class="py-16 text-center border border-dashed border-slate-100"
    >
      <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 italic">
        Zero recipient funds defined
      </p>
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div
        v-for="fund in funds"
        :key="fund.id"
        class="p-6 bg-white border border-slate-50 hover:border-violet-100 transition-all duration-300 group shadow-sm hover:shadow-md"
      >
        <div class="flex items-start justify-between mb-6">
          <div class="space-y-1.5">
            <p class="text-sm font-black text-slate-900 tracking-tight uppercase leading-none max-w-[200px] truncate" :title="fund.name">
              {{ fund.name }}
            </p>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
              Fund Target
            </p>
          </div>
          <div class="text-right space-y-1.5">
            <div class="flex flex-col items-end gap-1.5">
              <p
                v-for="t in fund.totals"
                :key="t.currency"
                class="text-sm font-black text-slate-900 italic tracking-tight leading-none"
              >
                {{ formatCurrency(t.amount, t.currency) }}
              </p>
              <p
                v-if="!fund.totals?.length"
                class="text-sm font-black text-slate-900 italic leading-none"
              >
                GHS 0.00
              </p>
            </div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
              Raised Today
            </p>
          </div>
        </div>

        <div v-if="fund.targetAmount > 0">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progress</span>
            <span class="text-[11px] font-black text-slate-900 tabular-nums">{{ calculateProgress(fund) }}%</span>
          </div>
          <div class="h-0.5 w-full bg-slate-50 overflow-hidden">
            <div 
              class="h-full bg-slate-900 group-hover:bg-violet-600 transition-all duration-1000"
              :style="{ width: `${calculateProgress(fund)}%` }"
            />
          </div>
        </div>
        <div 
          v-else 
          class="pt-6 border-t border-slate-50"
        >
          <span class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Open Target</span>
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
