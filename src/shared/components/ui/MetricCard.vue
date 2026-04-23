<template>
  <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
    <div class="flex items-center gap-x-3">
      <div
        v-if="icon"
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
      >
        <component
          :is="icon"
          class="h-5 w-5"
        />
      </div>
      <p class="text-sm font-medium leading-6 text-gray-600">
        {{ label }}
      </p>
    </div>
    <div class="mt-4 flex items-baseline gap-x-2">
      <span class="text-3xl font-semibold tracking-tight text-gray-900">{{ value }}</span>
      <span
        v-if="suffix"
        class="text-sm font-medium text-gray-500"
      >{{ suffix }}</span>
    </div>
    <div
      v-if="trend"
      class="mt-2 flex items-center gap-x-1"
    >
      <span :class="['text-xs font-medium', trend > 0 ? 'text-green-600' : 'text-red-600']">
        {{ trend > 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}%
      </span>
      <span class="text-xs text-gray-500">vs last month</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  suffix?: string
  icon?: any
  trend?: number
}>()
</script>
