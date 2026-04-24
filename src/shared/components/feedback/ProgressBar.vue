<template>
  <div class="w-full">
    <div 
      v-if="label || showValue"
      class="flex items-center justify-between mb-2"
    >
      <span
        v-if="label"
        class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic"
      >
        {{ label }}
      </span>
      <span
        v-if="showValue"
        class="text-[10px] font-black text-slate-900 italic"
      >
        {{ percentage }}%
      </span>
    </div>
    <div 
      class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"
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
  color?: 'violet' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'red'
  containerClass?: string
}>(), {
  max: 100,
  label: '',
  showValue: false,
  color: 'violet',
  containerClass: ''
})

const percentage = computed(() => {
  if (props.max <= 0) return 0
  return Math.min(Math.round((props.value / props.max) * 100), 100)
})

const barClass = computed(() => {
  const maps: Record<string, string> = {
    violet: 'bg-violet-600',
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  }
  return maps[props.color] || maps.violet
})
</script>
