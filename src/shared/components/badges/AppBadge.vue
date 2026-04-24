<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  }>(),
  {
    tone: 'neutral',
  },
)

const classes = computed(() => {
  const base = 'inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300'
  const toneMap = {
    neutral: 'bg-slate-100 text-slate-500 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border border-amber-100',
    danger: 'bg-rose-50 text-rose-600 border border-rose-100',
    info: 'bg-violet-50 text-violet-600 border border-violet-100',
  }

  return `${base} ${toneMap[props.tone]}`
})
</script>
