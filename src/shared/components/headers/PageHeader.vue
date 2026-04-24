<template>
  <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p
        v-if="eyebrow"
        class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600"
      >
        {{ eyebrow }}
      </p>
      <h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="mt-3 max-w-2xl text-sm text-slate-500"
      >
        {{ description }}
      </p>
    </div>
    <div
      v-if="$slots.actions"
      class="flex flex-wrap gap-3"
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
