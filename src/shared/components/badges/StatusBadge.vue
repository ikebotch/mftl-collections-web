<template>
  <span 
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 shadow-sm"
    :class="toneClasses"
  >
    <span
      v-if="dot"
      class="w-1.5 h-1.5 rounded-full"
      :class="dotClasses"
    />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
    dot?: boolean
  }>(),
  {
    tone: 'neutral',
    dot: false
  },
)

const toneClasses = computed(() => {
  const maps = {
    neutral: 'bg-white text-slate-500 border-slate-200',
    success: 'bg-emerald-50/50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50/50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50/50 text-rose-700 border-rose-200',
    info: 'bg-blue-50/50 text-blue-700 border-blue-200',
    purple: 'bg-violet-50/50 text-violet-700 border-violet-200',
  }
  return maps[props.tone] || maps.neutral
})

const dotClasses = computed(() => {
  const maps = {
    neutral: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    purple: 'bg-violet-500',
  }
  return maps[props.tone] || maps.neutral
})
</script>
