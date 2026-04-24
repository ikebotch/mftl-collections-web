<template>
  <div 
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
    :class="statusClasses"
  >
    <span
      class="w-1.5 h-1.5 rounded-full"
      :class="dotClasses"
    />
    {{ status }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

const statusClasses = computed(() => {
  const s = props.status.toLowerCase()
  if (s === 'active' || s === 'online') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (s === 'inactive' || s === 'offline') return 'bg-slate-50 text-slate-600 border-slate-200'
  if (s === 'blocked') return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-slate-50 text-slate-600 border-slate-200'
})

const dotClasses = computed(() => {
  const s = props.status.toLowerCase()
  if (s === 'active' || s === 'online') return 'bg-emerald-500'
  if (s === 'inactive' || s === 'offline') return 'bg-slate-400'
  if (s === 'blocked') return 'bg-red-500'
  return 'bg-slate-400'
})
</script>
