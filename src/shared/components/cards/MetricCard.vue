<template>
  <AppCard class="relative overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-500" />
    <p class="text-sm font-medium text-slate-500">
      {{ label }}
    </p>
    <p class="mt-3 text-3xl font-semibold text-slate-950">
      {{ value }}
    </p>
    <p
      v-if="hint"
      class="mt-2 text-sm text-slate-500"
    >
      {{ hint }}
    </p>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from './AppCard.vue'

withDefaults(
  defineProps<{
    label: string
    value: string
    hint?: string
  }>(),
  {
    hint: '',
  },
)
</script>
