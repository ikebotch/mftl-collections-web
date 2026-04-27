<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
      <div class="flex flex-col">
        <span class="text-3xl font-black text-[#0F172A] leading-none">{{ formatCurrency(raised, currency) }}</span>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
          raised of {{ formatCurrency(goal, currency) }} goal
        </span>
      </div>
      <div class="sm:text-right">
        <span class="text-2xl font-black text-[#7C3AED] tabular-nums">{{ Math.round(percentage) }}%</span>
      </div>
    </div>
    
    <!-- Progress Track -->
    <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        class="h-full bg-[#7C3AED] rounded-full transition-all duration-1000 ease-out"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <div class="flex justify-between items-center pt-2">
      <div class="flex items-center gap-2">
        <div class="flex -space-x-2">
          <div v-for="i in 3" :key="i" class="w-7 h-7 rounded-full border-2 border-white bg-slate-200" />
        </div>
        <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">{{ donorCount }} donors</span>
      </div>
      <div class="flex items-center gap-1.5 text-slate-400">
        <Clock class="w-3.5 h-3.5" />
        <span class="text-[11px] font-black uppercase tracking-widest">{{ daysLeft }} days left</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { Clock } from 'lucide-vue-next'

const props = defineProps<{
  raised: number
  goal: number
  currency: string
  donorCount: number
  daysLeft: number
}>()

const percentage = computed(() => Math.min((props.raised / props.goal) * 100, 100))
</script>
