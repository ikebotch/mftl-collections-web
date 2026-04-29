<template>
  <AppCard
    shadow
    class="relative overflow-hidden group hover:shadow-premium transition-all duration-500 border border-slate-100/50 rounded-none bg-white"
  >
    <div class="p-8">
      <div class="flex items-start justify-between mb-8">
        <div 
          class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-soft"
          :class="colorClasses"
        >
          <component
            :is="resolvedIcon"
            class="w-7 h-7"
          />
        </div>
        <div 
          v-if="trend"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
          :class="trendPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'"
        >
          <span>{{ trendPositive ? '↑' : '↓' }}</span>
          <span>{{ trend }}</span>
        </div>
      </div>

      <div class="space-y-4">
        <p class="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] leading-none mb-4">
          {{ label }}
        </p>
        
        <div class="space-y-1">
          <template v-if="Array.isArray(value)">
            <h3 
              v-for="(val, idx) in value" 
              :key="idx"
              class="text-2xl font-black text-slate-900 font-display leading-tight tracking-tight flex items-center"
            >
              {{ val }}
              <span v-if="idx < value.length - 1" class="ml-2 text-slate-200">/</span>
              <span class="ml-1 text-slate-400 font-medium">•</span>
            </h3>
          </template>
          <h3 
            v-else
            class="text-2xl font-black text-slate-900 font-display leading-tight tracking-tight"
          >
            {{ value }}
            <span v-if="isCollectionCard" class="ml-1 text-slate-400 font-medium">•</span>
          </h3>
        </div>
      </div>

      <div
        v-if="progress !== undefined"
        class="mt-6 flex items-center gap-3"
      >
        <div class="h-1.5 flex-1 bg-slate-50 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-1000"
            :class="barColorClass"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <span
          v-if="progressLabel"
          class="text-[9px] font-black text-slate-400 uppercase tracking-widest"
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
  value: string | number | string[]
  icon?: string
  color?: 'purple' | 'green' | 'amber' | 'blue' | 'red' | 'slate' | 'emerald'
  trend?: string
  trendPositive?: boolean
  progress?: number
  progressLabel?: string
  isCollectionCard?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'Activity',
  color: 'purple',
  trend: '',
  trendPositive: true,
  progress: undefined,
  progressLabel: 'vs last period',
  isCollectionCard: false
})

const resolvedIcon = computed(() => (Icons as any)[props.icon] || Icons.Activity)

const colorClasses = computed(() => {
  const maps = {
    purple: 'bg-violet-50 text-violet-600',
    green: 'bg-emerald-50 text-emerald-600',
    emerald: 'bg-emerald-50 text-emerald-600',
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
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    slate: 'bg-slate-500',
  }
  return maps[props.color] || maps.purple
})
</script>
