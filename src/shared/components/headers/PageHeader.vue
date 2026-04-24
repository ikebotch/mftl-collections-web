<template>
  <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
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
        class="text-sm text-slate-600 font-medium max-w-xl"
      >
        {{ description }}
      </p>
    </div>
    <div
      v-if="$slots.actions"
      class="flex flex-wrap gap-3 mt-4 md:mt-0"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    eyebrow?: string
  }>(),
  {
    description: '',
    eyebrow: '',
  },
)
</script>
