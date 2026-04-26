<template>
  <AppCard
    rounded="2xl"
    shadow
    class="relative overflow-hidden group hover:shadow-premium transition-all duration-500 border border-slate-100/50"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <div 
          class="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-soft"
          :class="colorClasses"
        >
          <component
            :is="resolvedIcon"
            class="w-6 h-6"
          />
        </div>
        <div 
          v-if="trend"
          class="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
          :class="trendPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'"
        >
          <span>{{ trendPositive ? '↑' : '↓' }}</span>
          <span>{{ trend }}</span>
        </div>
      </div>

      <div class="space-y-1">
        <p class="text-[11px] font-bold text-slate-600 uppercase tracking-[0.15em] leading-none mb-2">
          {{ label }}
        </p>
        <h3 class="text-2xl font-black text-slate-900 font-display leading-none">
          {{ value }}
        </h3>
      </div>

      <div
        v-if="progress !== undefined"
        class="mt-4 flex items-center gap-2"
      >
        <div class="h-1 flex-1 bg-slate-50 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-1000"
            :class="barColorClass"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <span
          v-if="progressLabel"
          class="text-[9px] font-bold text-slate-600 uppercase tracking-widest"
        >
          {{ progressLabel }}
        </span>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppCard from './AppCard.vue'
import * as Icons from 'lucide-vue-next'

interface Props {
  label: string
  value: string | number
  icon?: string
  color?: 'purple' | 'green' | 'amber' | 'blue' | 'red' | 'slate'
  trend?: string
  trendPositive?: boolean
  progress?: number
  progressLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'Activity',
  color: 'purple',
  trend: '',
  trendPositive: true,
  progress: undefined,
  progressLabel: 'vs last period'
})

const resolvedIcon = computed(() => (Icons as any)[props.icon] || Icons.Activity)

const colorClasses = computed(() => {
  const maps = {
    purple: 'bg-violet-50 text-violet-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    slate: 'bg-slate-50 text-slate-600',
  }
  return maps[props.color] || maps.purple
})

const barColorClass = computed(() => {
  const maps = {
    purple: 'bg-violet-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    slate: 'bg-slate-500',
  }
  return maps[props.color] || maps.purple
})
</script>
