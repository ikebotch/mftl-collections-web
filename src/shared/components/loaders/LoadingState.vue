<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div class="relative w-16 h-16 mb-6">
      <div class="absolute inset-0 rounded-full border-4 border-brand-50 opacity-20" />
      <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600 animate-spin" />
    </div>
    <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 animate-pulse">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: 'Loading…',
  },
)
</script>
