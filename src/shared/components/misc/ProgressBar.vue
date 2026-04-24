<template>
  <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
    <div
      class="h-full transition-all duration-500 ease-out rounded-full"
      :class="colorClass"
      :style="{ width: `${clampedProgress}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    max?: number
    variant?: 'primary' | 'success' | 'warning' | 'danger'
  }>(),
  {
    max: 100,
    variant: 'primary',
  },
)

const clampedProgress = computed(() => {
  const percentage = (props.value / props.max) * 100
  return Math.min(Math.max(percentage, 0), 100)
})

const colorClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-emerald-500'
    case 'warning':
      return 'bg-amber-500'
    case 'danger':
      return 'bg-rose-500'
    default:
      return 'bg-violet-600'
  }
})
</script>
