<template>
  <div class="flex flex-col items-center justify-center py-24 px-6 text-center">
    <div class="relative w-12 h-12 mb-6">
      <div class="absolute inset-0 rounded-full border-2 border-slate-100" />
      <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-600 animate-spin" />
    </div>
    <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
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
    text: 'Syncing…',
  },
)
</script>
