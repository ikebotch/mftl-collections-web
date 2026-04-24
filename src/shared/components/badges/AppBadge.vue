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
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold'
  const toneMap = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-cyan-100 text-cyan-700',
  }

  return `${base} ${toneMap[props.tone]}`
})
</script>
