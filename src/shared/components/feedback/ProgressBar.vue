<template>
  <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
    <div 
      class="h-full transition-all duration-1000 rounded-full"
      :class="colorClasses"
      :style="{ width: `${Math.min(percentage, 100)}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  max: number
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'red'
}>()

const percentage = computed(() => {
  if (props.max <= 0) return 0
  return (props.value / props.max) * 100
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'emerald': return 'bg-emerald-500'
    case 'blue': return 'bg-blue-500'
    case 'purple': return 'bg-purple-500'
    case 'amber': return 'bg-amber-500'
    case 'red': return 'bg-red-500'
    default: return 'bg-slate-900'
  }
})
</script>
