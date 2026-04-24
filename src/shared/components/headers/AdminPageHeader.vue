<template>
  <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div class="space-y-1">
      <p
        v-if="eyebrow"
        class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-1"
      >
        {{ eyebrow }}
      </p>
      <h1 class="text-3xl font-bold tracking-tight text-slate-900 font-display">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-sm text-slate-600 font-medium max-w-2xl leading-relaxed"
      >
        {{ description }}
      </p>
    </div>
    
    <div class="flex flex-col gap-3 md:flex-row md:items-center">
      <div
        v-if="$slots.filter"
        class="w-full md:w-auto"
      >
        <slot name="filter" />
      </div>
      
      <div
        v-if="$slots.actions || $slots.primaryAction || $slots.secondaryActions"
        class="flex flex-wrap items-center gap-3"
      >
        <slot name="secondaryActions" />
        <slot name="actions" />
        <slot name="primaryAction" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  eyebrow?: string
}>()
</script>
