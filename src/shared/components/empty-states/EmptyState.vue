<template>
  <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
    <p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
      {{ eyebrow }}
    </p>
    <h2 class="mt-3 text-2xl font-semibold text-slate-950">
      {{ title }}
    </h2>
    <p class="mx-auto mt-3 max-w-xl text-sm text-slate-500">
      {{ description }}
    </p>
    <div
      v-if="$slots.action"
      class="mt-6 flex justify-center"
    >
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    eyebrow?: string
  }>(),
  {
    eyebrow: 'Nothing here yet',
  },
)
</script>
