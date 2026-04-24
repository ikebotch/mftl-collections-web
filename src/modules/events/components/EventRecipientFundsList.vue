<template>
  <div class="space-y-4">
    <div
      v-if="isLoading"
      class="flex items-center gap-3 py-4"
    >
      <Loader2 class="w-4 h-4 animate-spin text-slate-400" />
      <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading funds...</span>
    </div>
    <div
      v-else-if="isError"
      class="py-4 text-[10px] font-black uppercase tracking-widest text-red-500"
    >
      Failed to load funds.
    </div>
    <div
      v-else-if="funds.length === 0"
      class="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 italic"
    >
      No funds defined for this event.
    </div>
    <div
      v-else
      class="overflow-hidden rounded-2xl border border-slate-100 bg-white"
    >
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50">
            <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
              Fund Name
            </th>
            <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
              Target
            </th>
            <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">
              Raised
            </th>
            <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 w-32">
              Progress
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="fund in funds"
            :key="fund.id"
            class="group hover:bg-slate-50/30 transition-colors"
          >
            <td class="px-5 py-4 border-b border-slate-50">
              <p class="text-sm font-bold text-slate-900">
                {{ fund.name }}
              </p>
              <p
                v-if="fund.description"
                class="text-[10px] text-slate-400 mt-0.5 line-clamp-1"
              >
                {{ fund.description }}
              </p>
            </td>
            <td class="px-5 py-4 border-b border-slate-50 text-xs font-bold text-slate-500">
              {{ fund.targetAmount > 0 ? formatCurrency(fund.targetAmount, 'GHS') : 'No target' }}
            </td>
            <td class="px-5 py-4 border-b border-slate-50 text-sm font-black text-slate-900 text-right">
              {{ formatCurrency(fund.receivedAmount, 'GHS') }}
            </td>
            <td class="px-5 py-4 border-b border-slate-50">
              <div class="flex items-center gap-3">
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    :style="{ width: `${fund.targetAmount > 0 ? Math.min(100, Math.round((fund.receivedAmount / fund.targetAmount) * 100)) : 0}%` }"
                  />
                </div>
                <span class="text-[9px] font-black text-slate-900 min-w-[2rem] text-right">
                  {{ fund.targetAmount > 0 ? Math.round((fund.receivedAmount / fund.targetAmount) * 100) : 0 }}%
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'
import { formatCurrency } from '@/shared/utils/formatters'

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
</script>
