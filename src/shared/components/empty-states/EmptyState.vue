<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div class="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-100">
      📭
    </div>
    <p
      v-if="eyebrow"
      class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2"
    >
      {{ eyebrow }}
    </p>
    <h2 class="text-2xl font-bold text-slate-900 font-display">
      {{ title }}
    </h2>
    <p class="mx-auto mt-3 max-w-sm text-sm text-slate-500 font-medium">
      {{ description }}
    </p>
    <div
      v-if="$slots.action"
      class="mt-8 flex justify-center"
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
