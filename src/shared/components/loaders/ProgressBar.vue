<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-2">
      <span
        v-if="label"
        class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
      >
        {{ label }}
      </span>
      <span
        v-if="showValue"
        class="text-xs font-bold text-slate-900"
      >
        {{ percentage }}%
      </span>
    </div>
    <div 
      class="h-2 w-full bg-slate-100 rounded-full overflow-hidden"
      :class="containerClass"
    >
      <div 
        class="h-full rounded-full transition-all duration-1000 ease-out"
        :class="barClass"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  max?: number
  label?: string
  showValue?: boolean
  color?: 'violet' | 'emerald' | 'amber' | 'rose' | 'blue'
  containerClass?: string
}>(), {
  max: 100,
  label: '',
  showValue: false,
  color: 'violet',
  containerClass: ''
})

const percentage = computed(() => {
  return Math.min(Math.round((props.value / props.max) * 100), 100)
})

const barClass = computed(() => {
  const maps = {
    violet: 'bg-violet-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
  }
  return maps[props.color] || maps.violet
})
</script>
