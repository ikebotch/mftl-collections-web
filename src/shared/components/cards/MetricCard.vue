<template>
  <AppCard class="group">
    <div class="flex items-center justify-between mb-4">
      <div class="p-3 rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-sm">
        <component
          :is="icon"
          v-if="icon"
          class="w-6 h-6"
        />
        <div
          v-else
          class="w-6 h-6 rounded-full bg-current opacity-20"
        />
      </div>
      <div
        v-if="trend"
        :class="[
          'flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full',
          trend.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        ]"
      >
        <span v-if="trend.positive">↑</span>
        <span v-else>↓</span>
        {{ trend.value }}
      </div>
    </div>
    
    <div>
      <h3 class="text-sm font-medium text-slate-500 mb-1 group-hover:text-brand-700 transition-colors duration-300">
        {{ label }}
      </h3>
      <div class="flex items-baseline gap-2">
        <p class="text-2xl font-bold text-slate-900 font-display">
          {{ value }}
        </p>
        <p
          v-if="hint"
          class="text-xs text-slate-400"
        >
          {{ hint }}
        </p>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import AppCard from './AppCard.vue'

withDefaults(
  defineProps<{
    label: string
    value: string
    hint?: string
    icon?: Component
    trend?: {
      value: string
      positive: boolean
    }
  }>(),
  {
    hint: '',
    icon: undefined,
    trend: undefined,
  },
)
</script>
